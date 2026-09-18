"""Telegram handlers. Thin client: every decision comes from the server response."""
from __future__ import annotations

import io
import logging
from html import escape

from telegram import Update
from telegram.constants import ChatAction, ParseMode
from telegram.error import BadRequest, NetworkError, TelegramError
from telegram.ext import ContextTypes

from . import config, render, state, tts
from .api import Backend, BackendError
from .strings import t

log = logging.getLogger("thittam.bot")
backend = Backend()
HTML = ParseMode.HTML


def _lang_from_user(update: Update) -> str:
    code = (update.effective_user.language_code or "") if update.effective_user else ""
    return code[:2] if code[:2] in ("ta", "hi", "en") else config.DEFAULT_LANG


async def _send(ctx, chat_id: int, text: str, markup=None):
    return await ctx.bot.send_message(chat_id, text, parse_mode=HTML, reply_markup=markup,
                                      disable_web_page_preview=True)


# ---------- core: render a server response as a sequence of messages ----------

async def show_response(ctx, chat_id: int, st: state.ChatState, resp: dict) -> None:
    lang = st.lang
    st.last = resp

    learned = render.learned_text(resp, lang)
    if learned:
        await _send(ctx, chat_id, learned)

    sig = render.card_signature(resp)
    if sig != st.card_sig:
        if st.card_msg_id:
            try:
                await ctx.bot.delete_message(chat_id, st.card_msg_id)
            except TelegramError:
                pass
        text, kb = render.results_card(resp, lang)
        msg = await _send(ctx, chat_id, text, kb)
        st.card_msg_id, st.card_sig = msg.message_id, sig

    hints = render.hints(resp, lang)
    new_hints = set(resp.get("hints") or []) - st.hints_shown
    if hints and new_hints:
        st.hints_shown |= new_hints
        await _send(ctx, chat_id, hints)

    st.q_id += 1
    st.question = resp.get("next_question")
    await _send(ctx, chat_id, escape(resp["reply"]), render.reply_keyboard(resp, st.q_id))

    if st.voice_on:
        await ctx.bot.send_chat_action(chat_id, ChatAction.RECORD_VOICE)
        audio = await tts.speak(resp["reply"], lang)
        if audio:
            try:
                await ctx.bot.send_voice(chat_id, voice=io.BytesIO(audio), filename="thittam.mp3")
            except TelegramError as e:
                log.warning("send_voice failed (%s); sending as audio", e)
                try:
                    await ctx.bot.send_audio(chat_id, audio=io.BytesIO(audio), filename="thittam.mp3")
                except TelegramError:
                    pass


async def process_text(ctx, chat_id: int, st: state.ChatState, text: str) -> None:
    st.last_user_text = text
    await ctx.bot.send_chat_action(chat_id, ChatAction.TYPING)
    try:
        resp = await backend.chat(state.session_id(chat_id), text, st.lang)
    except BackendError as e:
        log.error("backend chat failed: %s", e)
        await _send(ctx, chat_id, t("error", st.lang), render.retry_keyboard(st.lang))
        return
    await show_response(ctx, chat_id, st, resp)


# ---------- commands ----------

async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    st = state.reset(chat_id)
    st.lang = _lang_from_user(update) if not st.lang_chosen else st.lang
    try:
        await backend.reset(state.session_id(chat_id))
    except BackendError:
        pass
    await _send(ctx, chat_id, t("welcome", "en"), render.language_keyboard())


async def cmd_lang(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await _send(ctx, update.effective_chat.id, t("welcome", "en"), render.language_keyboard())


async def cmd_reset(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    st = state.reset(chat_id)
    try:
        await backend.reset(state.session_id(chat_id))
    except BackendError:
        pass
    await _send(ctx, chat_id, f"{t('reset_done', st.lang)}\n\n{t('intro', st.lang)}")


async def cmd_help(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    st = state.get(update.effective_chat.id)
    await _send(ctx, update.effective_chat.id, f"{t('help', st.lang)}\n\n⚠️ <i>{t('disclaimer', st.lang)}</i>")


async def cmd_voice(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    st = state.get(update.effective_chat.id)
    st.voice_on = not st.voice_on
    await _send(ctx, update.effective_chat.id, t("voice_on" if st.voice_on else "voice_off", st.lang))


async def cmd_profile(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    st = state.get(update.effective_chat.id)
    await _send(ctx, update.effective_chat.id, render.profile(st.last, st.lang))


async def cmd_schemes(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    st = state.get(chat_id)
    if not st.last:
        await _send(ctx, chat_id, t("no_results", st.lang))
        return
    text, kb = render.results_card(st.last, st.lang)
    msg = await _send(ctx, chat_id, text, kb)
    st.card_msg_id, st.card_sig = msg.message_id, render.card_signature(st.last)


async def cmd_docs(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    st = state.get(update.effective_chat.id)
    await _send(ctx, update.effective_chat.id, render.documents(st.last or {}, st.lang))


# ---------- messages ----------

async def on_text(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    st = state.get(chat_id)
    if not st.lang_chosen and not st.last:
        st.lang = _lang_from_user(update)
    await process_text(ctx, chat_id, st, update.message.text.strip())


async def on_voice(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    st = state.get(chat_id)
    media = update.message.voice or update.message.audio
    if media.duration and media.duration > config.MAX_VOICE_SECONDS:
        await _send(ctx, chat_id, t("too_long", st.lang, s=config.MAX_VOICE_SECONDS))
        return
    await ctx.bot.send_chat_action(chat_id, ChatAction.TYPING)
    try:
        f = await media.get_file()
        audio = bytes(await f.download_as_bytearray())
        text = await backend.transcribe(audio, st.lang)
    except (BackendError, TelegramError) as e:
        log.error("transcription failed: %s", e)
        text = ""
    if not text:
        await _send(ctx, chat_id, t("stt_fail", st.lang))
        return
    await _send(ctx, chat_id, f"{t('heard', st.lang)} <i>{escape(text)}</i>")
    await process_text(ctx, chat_id, st, text)


async def on_other(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if update.effective_chat:
        st = state.get(update.effective_chat.id)
        await _send(ctx, update.effective_chat.id, t("other_type", st.lang))


# ---------- buttons ----------

async def _edit(q, text: str, markup=None):
    try:
        await q.edit_message_text(text, parse_mode=HTML, reply_markup=markup, disable_web_page_preview=True)
    except BadRequest as e:
        if "not modified" not in str(e).lower():
            raise


async def on_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    chat_id = q.message.chat.id
    st = state.get(chat_id)
    data = q.data or ""
    kind, _, rest = data.partition("|")

    if kind == "l":
        await q.answer()
        st.lang, st.lang_chosen = rest, True
        await _edit(q, f"{t('intro', st.lang)}\n\n⚠️ <i>{t('disclaimer', st.lang)}</i>")
        return

    if kind == "r":
        await q.answer()
        if st.last_user_text:
            await process_text(ctx, chat_id, st, st.last_user_text)
        return

    if kind == "a":
        qid_s, _, idx_s = rest.partition("|")
        if not st.question or str(st.q_id) != qid_s:
            await q.answer(t("stale", st.lang))
            return
        await q.answer()
        field = st.question["field"]
        opt = st.question["options"][int(idx_s)]
        # show the chosen answer and remove the buttons
        try:
            await q.edit_message_text(f"{q.message.text_html}\n\n➜ <b>{escape(opt['label'])}</b>", parse_mode=HTML)
        except TelegramError:
            pass
        st.question = None
        await ctx.bot.send_chat_action(chat_id, ChatAction.TYPING)
        try:
            resp = await backend.answer(state.session_id(chat_id), field, opt.get("value"),
                                        bool(opt.get("skip")), st.lang)
        except BackendError as e:
            log.error("backend answer failed: %s", e)
            await _send(ctx, chat_id, t("error", st.lang))
            return
        await show_response(ctx, chat_id, st, resp)
        return

    await q.answer()
    if not st.last:
        await _send(ctx, chat_id, t("no_results", st.lang))
        return

    if kind == "s":
        r = render.find_result(st.last, rest)
        if r:
            text, kb = render.scheme_detail(st.last, r, st.lang)
            await _send(ctx, chat_id, text, kb)
    elif kind == "b" and rest in ("likely", "need_info", "not_eligible"):
        text, kb = render.bucket_list(st.last, rest, st.lang)
        await _edit(q, text, kb)
    elif kind == "c":
        text, kb = render.results_card(st.last, st.lang)
        await _edit(q, text, kb)
    elif kind == "d":
        await _send(ctx, chat_id, render.documents(st.last, st.lang))


async def on_error(update: object, ctx: ContextTypes.DEFAULT_TYPE):
    if isinstance(ctx.error, NetworkError):  # transient Telegram connectivity blip; the library retries
        log.warning("Telegram network blip: %s", ctx.error)
        return
    log.exception("unhandled error", exc_info=ctx.error)
