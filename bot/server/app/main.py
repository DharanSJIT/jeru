"""Thittam API server. Run from PROJECT_BOT/server:  uvicorn app.main:app --port 8000"""
from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Any, Literal

from fastapi import FastAPI, File, Form, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import config, orchestrator, report, session
from .agents import llm, retrieval
from .fields import FIELDS, tr

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    asyncio.get_running_loop().run_in_executor(None, retrieval.warmup)  # load models without blocking startup
    yield


app = FastAPI(title="Thittam API", version="0.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=config.CORS_ORIGINS, allow_methods=["*"], allow_headers=["*"])

Lang = Literal["en", "ta", "hi"]
Channel = Literal["web", "telegram"]


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=2000)
    lang: Lang = "en"
    channel: Channel = "web"


class AnswerRequest(BaseModel):
    session_id: str = Field(min_length=1, max_length=100)
    field: str
    value: Any = None
    skip: bool = False
    lang: Lang = "en"
    channel: Channel = "web"


class SessionRequest(BaseModel):
    session_id: str


class EvaluateRequest(BaseModel):
    profile: dict
    lang: Lang = "en"


@app.get("/api/health")
async def health():
    return {"ok": True, "llm": "up" if llm.available() else "down", "model": config.LLM_MODEL,
            "schemes": len(orchestrator.SCHEMES)}


@app.post("/api/chat")
async def chat(req: ChatRequest):
    s = session.get(req.session_id)
    async with s.lock:
        return await orchestrator.chat(s, req.message.strip(), req.lang, req.channel)


@app.post("/api/answer")
async def answer(req: AnswerRequest):
    if req.field not in FIELDS:
        raise HTTPException(400, f"unknown field '{req.field}'")
    s = session.get(req.session_id)
    async with s.lock:
        return await orchestrator.answer(s, req.field, req.value, req.lang, req.skip, req.channel)


@app.post("/api/evaluate")
async def evaluate(req: EvaluateRequest):
    return await orchestrator.evaluate_profile(req.profile, req.lang)


@app.post("/api/session/reset")
async def reset(req: SessionRequest):
    session.reset(req.session_id)
    return {"ok": True}


@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    s = session.peek(session_id)
    if not s or not s.last_response:
        raise HTTPException(404, "no such session")
    return s.last_response


@app.get("/api/session/{session_id}/report")
async def session_report(session_id: str, lang: Lang = "en"):
    """PDF report of the session: profile, schemes by status with reasons, documents, how to apply.
    Built in memory and streamed back; nothing is written to disk."""
    s = session.peek(session_id)
    if not s or not s.profile:
        raise HTTPException(404, "no profile in this session yet")
    snap = orchestrator.report_snapshot(s, lang)
    pdf = await asyncio.to_thread(report.build_report, snap, lang)
    return Response(pdf, media_type="application/pdf",
                    headers={"Content-Disposition": f'attachment; filename="thittam-report-{lang}.pdf"'})


@app.get("/api/search")
async def search(q: str, k: int = 5):
    """Retrieval pipeline, every stage visible: dense rank, BM25 rank, RRF, reranker score."""
    hits = await retrieval.search(q)
    if hits is None:
        raise HTTPException(503, "retrieval unavailable")
    return {"query": q, "hits": [{**t, "chunk": h["chunk"], "context": h["context"]}
                                 for t, h in zip(retrieval.trace_view(hits), hits)][:k]}


@app.get("/api/schemes")
async def schemes(lang: Lang = "en"):
    return [{"id": s["id"], "name": tr(s["name"], lang), "level": s["level"], "state": s.get("state"),
             "category": s["category"], "unverified": s["unverified"]} for s in orchestrator.SCHEMES]


@app.get("/api/schemes/{scheme_id}")
async def scheme(scheme_id: str):
    s = orchestrator.SCHEMES_BY_ID.get(scheme_id)
    if not s:
        raise HTTPException(404, "unknown scheme")
    return s


@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...), lang: str = Form("ta")):
    audio = await file.read()
    if not audio:
        raise HTTPException(400, "empty audio")
    if len(audio) > 20 * 1024 * 1024:
        raise HTTPException(413, "audio too large")
    try:
        text = await llm.transcribe(audio, file.filename or "voice.ogg", lang)
    except llm.LLMError as e:
        raise HTTPException(502, f"transcription failed: {e}")
    return {"text": text}
