"""Per-turn pipeline (ARCHITECTURE.md §6): extract -> normalise -> derive -> evaluate -> plan -> respond."""
from __future__ import annotations

import logging
import time

from .agents import answerer, extractor, llm, numerals, responder, retrieval
from .agents.normalise import apply_updates, normalise_value, side_effects
from .engine.catalogue import load_schemes
from .engine.derive import derive
from .engine.planner import next_field, question_payload
from .engine.rules import evaluate_all
from .engine.summary import build_documents, build_hints, build_results, build_summary
from .fields import FIELDS, UI, tr
from .formatting import field_label, value_display
from .session import Session

log = logging.getLogger("thittam.orchestrator")

SCHEMES = load_schemes()
SCHEMES_BY_ID = {s["id"]: s for s in SCHEMES}


class Trace:
    def __init__(self):
        self.steps: list[dict] = []
        self._t = time.perf_counter()

    def mark(self, step: str, **detail):
        now = time.perf_counter()
        self.steps.append({"step": step, "ms": round((now - self._t) * 1000), **({"detail": detail} if detail else {})})
        self._t = now


def _display_changes(entries: list[dict], lang: str) -> list[dict]:
    out = []
    for e in entries:
        item = {"field": e["field"], "label": field_label(e["field"], lang), "display": value_display(e["field"], e["new"], lang)}
        if e.get("old") is not None:
            item["from_display"] = value_display(e["field"], e["old"], lang)
        out.append(item)
    return out


def _profile_view(profile: dict, facts: dict, inferred: set, lang: str) -> list[dict]:
    view = []
    for f in FIELDS:
        v = profile.get(f)
        if v is None and f in inferred:
            v = facts.get(f)
        if v is None:
            continue
        view.append({"field": f, "label": field_label(f, lang), "display": value_display(f, v, lang),
                     "inferred": f in inferred and profile.get(f) is None})
    return view


async def _finish(s: Session, *, lang: str, channel: str, user_message: str | None,
                  learned: list[dict], changes: list[dict], trace: Trace, question: dict | None = None) -> dict:
    facts, inferred = derive(s.profile)
    raw = evaluate_all(facts, SCHEMES, lang)
    results = build_results(raw, SCHEMES_BY_ID, lang)
    trace.mark("evaluate", schemes=len(SCHEMES))

    field = next_field(raw, SCHEMES_BY_ID, facts, s.asked, s.skipped)
    nq = question_payload(field, lang)
    if field:
        s.asked[field] = s.asked.get(field, 0) + 1
    s.last_field = field if field != "opening" else None
    trace.mark("plan", next_field=field)

    likely = results["likely"]
    summary = build_summary(likely, lang)
    learned_disp = _display_changes(learned, lang)
    changes_disp = _display_changes(changes, lang)
    learned_text = [f"{x['label']}: {x['display']}" for x in learned_disp + changes_disp]

    reply = None
    answered: list[str] = []
    if question:
        # The user asked about specific schemes: answer from their records + this user's evaluation,
        # then continue the interview with the planner's next question.
        by_id = {r["scheme_id"]: r for bucket in results.values() for r in bucket}
        asked_about = [by_id[i] for i in question["scheme_ids"] if i in by_id]
        answered = [r["scheme_id"] for r in asked_about]
        try:
            reply = await answerer.answer(question=user_message or "", topic=question["topic"],
                                          results=asked_about, lang=lang, passages=question.get("passages"))
            trace.mark("answer_question", schemes=answered)
        except llm.LLMError as e:
            log.warning("answerer failed: %s", e)
            trace.mark("answer_question", error=str(e))
            reply = answerer.template_answer(asked_about, lang)
        if nq:
            reply = f"{reply}\n\n{nq['text']}"
    elif llm.available():
        try:
            reply = await responder.respond(
                lang=lang, channel=channel, user_message=user_message, learned=learned_text,
                likely_count=len(likely), top_likely=[r["name"] for r in likely],
                next_question=nq["text"] if nq else None)
            trace.mark("respond")
        except llm.LLMError as e:
            log.warning("responder failed: %s", e)
            trace.mark("respond", error=str(e))
    if not reply:
        reply = responder.template_reply(lang, len(likely), nq["text"] if nq else None, bool(learned_text))

    s.history.append({"role": "assistant", "text": reply})
    s.history = s.history[-12:]

    response = {
        "session_id": s.id,
        "reply": reply,
        "profile": s.profile,
        "profile_view": _profile_view(s.profile, facts, inferred, lang),
        "evidence": s.evidence,
        "learned": learned_disp,
        "changes": changes_disp,
        "results": results,
        "summary": summary,
        "documents": build_documents(likely, lang),
        "hints": build_hints(facts, lang),
        "next_question": nq,
        "answered_schemes": answered,
        "disclaimer": tr(UI["disclaimer"], lang),
        "trace": trace.steps,
    }
    s.last_response = response
    return response


async def chat(s: Session, message: str, lang: str, channel: str = "web") -> dict:
    trace = Trace()
    s.turn += 1
    s.history.append({"role": "user", "text": message})
    learned, changes, question = [], [], None
    if llm.available():
        try:
            updates, question = await extractor.extract(
                numerals.to_digits(message), s.history[:-1], s.last_field, s.profile)
            trace.mark("extract", updates=updates, question=question)
            learned, changes = apply_updates(s.profile, updates, s.turn, s.evidence)
        except llm.LLMError as e:
            question = None
            log.warning("extractor failed: %s", e)
            trace.mark("extract", error=str(e))
    else:
        trace.mark("extract", error="LLM not configured")
    trace.mark("normalise", learned=len(learned), changes=len(changes))
    if question is not None:
        hits = await retrieval.search(message)
        merged = retrieval.merge_question(question, hits)
        trace.mark("retrieve", hits=retrieval.trace_view(hits),
                   extractor_ids=question["scheme_ids"], final=merged and merged["scheme_ids"],
                   topic=merged and merged["topic"], source=merged and merged["source"])
        question = merged
    return await _finish(s, lang=lang, channel=channel, user_message=message,
                         learned=learned, changes=changes, trace=trace, question=question)


async def answer(s: Session, field: str, value, lang: str, skip: bool = False, channel: str = "web") -> dict:
    trace = Trace()
    s.turn += 1
    learned, changes = [], []
    if skip or value is None:
        s.skipped.add(field)
    else:
        v = normalise_value(field, value)
        if v is not None:
            old = s.profile.get(field)
            s.profile[field] = v
            s.evidence[field] = {"value": v, "quote": "(button)", "turn": s.turn}
            (changes if old is not None and old != v else learned).append({"field": field, "old": old, "new": v})
            learned.extend(side_effects(s.profile, field, v))
            s.history.append({"role": "user", "text": f"[{field} = {v}]"})
    trace.mark("answer", field=field, value=value, skip=skip)
    return await _finish(s, lang=lang, channel=channel, user_message=None,
                         learned=learned, changes=changes, trace=trace)


def report_snapshot(s: Session, lang: str) -> dict:
    """Everything the PDF report shows, recomputed from the session profile in `lang` (no LLM, no side effects)."""
    facts, inferred = derive(s.profile)
    raw = evaluate_all(facts, SCHEMES, lang)
    results = build_results(raw, SCHEMES_BY_ID, lang)
    likely = results["likely"]
    return {
        "profile_view": _profile_view(s.profile, facts, inferred, lang),
        "results": results,
        "summary": build_summary(likely, lang),
        "documents": build_documents(likely, lang),
        "hints": build_hints(facts, lang),
        "disclaimer": tr(UI["disclaimer"], lang),
    }


async def evaluate_profile(profile: dict, lang: str) -> dict:
    """Stateless form mode: no LLM, same engine."""
    clean = {}
    for f, v in (profile or {}).items():
        nv = normalise_value(f, v)
        if nv is not None:
            clean[f] = nv
    facts, _ = derive(clean)
    raw = evaluate_all(facts, SCHEMES, lang)
    results = build_results(raw, SCHEMES_BY_ID, lang)
    return {
        "profile": clean,
        "results": results,
        "summary": build_summary(results["likely"], lang),
        "documents": build_documents(results["likely"], lang),
        "hints": build_hints(facts, lang),
        "disclaimer": tr(UI["disclaimer"], lang),
    }
