"""HTTP client for the Thittam server. The bot never decides anything itself."""
from __future__ import annotations

import httpx

from . import config


class BackendError(RuntimeError):
    pass


class Backend:
    def __init__(self):
        self.client = httpx.AsyncClient(base_url=config.BACKEND_URL, timeout=config.BACKEND_TIMEOUT_S)

    async def _post(self, path: str, **kwargs) -> dict:
        try:
            r = await self.client.post(path, **kwargs)
            r.raise_for_status()
            return r.json()
        except httpx.HTTPError as e:
            raise BackendError(f"{path}: {type(e).__name__}: {e}") from e

    async def chat(self, session_id: str, message: str, lang: str) -> dict:
        return await self._post("/api/chat", json={"session_id": session_id, "message": message[:2000],
                                                   "lang": lang, "channel": "telegram"})

    async def answer(self, session_id: str, field: str, value, skip: bool, lang: str) -> dict:
        return await self._post("/api/answer", json={"session_id": session_id, "field": field, "value": value,
                                                     "skip": skip, "lang": lang, "channel": "telegram"})

    async def reset(self, session_id: str) -> None:
        await self._post("/api/session/reset", json={"session_id": session_id})

    async def transcribe(self, audio: bytes, lang: str) -> str:
        data = await self._post("/api/transcribe", files={"file": ("voice.ogg", audio, "audio/ogg")},
                                data={"lang": lang})
        return (data.get("text") or "").strip()

    async def health(self) -> dict:
        try:
            r = await self.client.get("/api/health")
            return r.json()
        except httpx.HTTPError as e:
            raise BackendError(str(e)) from e
