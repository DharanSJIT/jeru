# PROJECT_BOT: Thittam on Telegram

**Bot:** https://t.me/jce_hackathon_bot

Thittam (PS 1, The Scheme Seeker) as a Telegram bot + Python server. Citizens chat or send voice notes in Tamil / English / Hindi and get schemes they may be eligible for, with per-rule reasons, benefits, documents, how to apply, and the "final decision is the department's" disclaimer.

```
PROJECT_BOT/
  server/   FastAPI API: rule engine, planner, Groq LLM agents, scheme catalogue, tests
  bot/      Telegram client (thin): renders server responses, voice in/out, buttons
  vectordb/ scheme retrieval: recursive chunking, dense + BM25 + RRF, cross-encoder rerank (RETRIEVAL.md)
  .env      secrets (gitignored) — shared by server and bot
  start.bat one-click launcher (opens both in separate windows)
  retrieval_demo.bat  judge walkthrough of chunking + reranking with evaluation numbers
```

| Doc | Purpose |
|---|---|
| [BOT_PLAN.md](../docs/BOT_PLAN.md) | Timeline, task board, dependencies, risks |
| [BOT_SPEC.md](../docs/BOT_SPEC.md) | UX flow, commands, buttons, message templates, contract |
| [BOT_DEMO.md](../docs/BOT_DEMO.md) | Stage setup + demo script |
| [vectordb/RETRIEVAL.md](vectordb/RETRIEVAL.md) | Chunking + hybrid retrieval + reranking, results, talk track |

## How it works

```
Telegram voice note ──► bot ──► POST /api/transcribe (Groq whisper-large-v3)
Telegram text ─────────► bot ──► POST /api/chat
                                   ├─ numerals.to_digits   (ஐயாயிரம் → 5000, deterministic)
                                   ├─ extractor  (Groq openai/gpt-oss-120b, JSON) → profile facts + quotes
                                   ├─ normalise + derive   (Python, validated)
                                   ├─ retrieval (scheme questions only) dense + BM25 → RRF → cross-encoder rerank
                                   ├─ rules engine         (3-valued: likely / need info / not eligible)
                                   ├─ planner              (next best question + button options)
                                   └─ responder  (Groq, replies in ta/en/hi; sees engine output only)
Button tap ────────────► bot ──► POST /api/answer (sets the field directly, no LLM)
bot ◄── reply text + gTTS voice note + results card + scheme detail buttons
```

If Groq is slow, the server retries once on `openai/gpt-oss-20b`. If Groq is down, extraction is skipped and replies fall back to templates. The buttons and rule engine keep working.

## Run

First time:
```bash
cd PROJECT_BOT
python -m venv .venv
.venv\Scripts\pip install -r server\requirements.txt -r requirements.txt
copy .env.example .env      # fill TELEGRAM_BOT_TOKEN and GROQ_API_KEY
```

Every time: double-click **`start.bat`**, or use two terminals:
```bash
cd PROJECT_BOT/server && ../.venv/Scripts/python -m uvicorn app.main:app --port 8000
cd PROJECT_BOT        && .venv/Scripts/python -m bot.main
```
Check `http://localhost:8000/api/health` → `"llm": "up"`.

Tests (no network or models needed; 93 checks incl. 6 personas):
```bash
cd PROJECT_BOT/server && ../.venv/Scripts/python -m pytest -q
```

Retrieval walkthrough for judges (first run downloads ~1.3 GB of models into `vectordb/.models`):
```bash
cd PROJECT_BOT && .venv/Scripts/python -m vectordb.demo      # or double-click retrieval_demo.bat
```
Live: `http://localhost:8000/api/search?q=widow%20pension` shows every stage's rank for a query.

## Bot commands
`/start` language picker · `/schemes` results card · `/docs` document checklist · `/profile` what the bot understood · `/voice` voice replies on/off · `/lang` · `/reset` · `/help`

## Gotchas
- **`.env` overrides system env vars** (`override=True`). This machine had an old, invalid `GROQ_API_KEY` set globally that caused 401s.
- The laptop running the bot must **not sleep**, or the bot goes offline.
- Telegram API can be slow on some networks. The bot uses 30–40 s timeouts and retries startup forever.
- Scheme data is seed data (`"unverified": true`). Verify it against official sources before the demo (see ../docs/DATA_SPEC.md).
