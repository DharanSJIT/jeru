"""Settings for the standalone vector DB (env vars override)."""

from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCHEMES_PATH = Path(os.getenv("SCHEMES_PATH", ROOT.parent / "server" / "data" / "schemes.json"))

MILVUS_URI = os.getenv("MILVUS_URI", "http://localhost:19530")
MILVUS_TOKEN = os.getenv("MILVUS_TOKEN", "")
COLLECTION = os.getenv("MILVUS_COLLECTION", "thittam_schemes")

# Chunking (characters). Section text is split recursively; every chunk gets a "scheme | section" header.
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "300"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "60"))

# Models (fastembed / ONNX, downloaded once into MODEL_CACHE). "hash" / "none" = no model.
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
RERANK_MODEL = os.getenv("RERANK_MODEL", "jinaai/jina-reranker-v2-base-multilingual")
MODEL_CACHE = os.getenv("MODEL_CACHE", str(ROOT / ".models"))
HASH_DIM = int(os.getenv("HASH_DIM", "512"))

# Retrieval
CANDIDATES = int(os.getenv("RETRIEVE_CANDIDATES", "30"))  # fused pool handed to the reranker
RRF_K = int(os.getenv("RRF_K", "60"))
