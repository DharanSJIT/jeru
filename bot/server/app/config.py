import os
from pathlib import Path

from dotenv import load_dotenv

# PROJECT_BOT/.env is shared by server and bot
load_dotenv(Path(__file__).resolve().parents[2] / ".env", override=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
# comma-separated; each Groq model has its own rate limit, so fallbacks add capacity
LLM_FALLBACK_MODELS = [m.strip() for m in os.getenv(
    "LLM_FALLBACK_MODELS", "openai/gpt-oss-20b,qwen/qwen3.8-27b").split(",") if m.strip()]
LLM_REASONING_EFFORT = os.getenv("LLM_REASONING_EFFORT", "low")
LLM_TIMEOUT_S = float(os.getenv("LLM_TIMEOUT_S", "8"))
STT_MODEL = os.getenv("STT_MODEL", "whisper-large-v3")
SESSION_TTL_S = int(os.getenv("SESSION_TTL_S", "1800"))
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",")]

# Scheme retrieval for Q&A (PROJECT_BOT/vectordb: recursive chunks, dense + BM25 + RRF, cross-encoder rerank).
# In-memory search, no Milvus needed. Off -> the extractor's scheme pick is used as before.
RETRIEVAL_ENABLED = os.getenv("RETRIEVAL_ENABLED", "1").lower() not in ("0", "false", "no", "")
RETRIEVAL_TIMEOUT_S = float(os.getenv("RETRIEVAL_TIMEOUT_S", "4"))
RETRIEVAL_MIN_SCORE = float(os.getenv("RETRIEVAL_MIN_SCORE", "0.3"))  # reranker relevance to add a scheme
