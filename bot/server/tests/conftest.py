import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest  # noqa: E402


@pytest.fixture(autouse=True)
def _no_retrieval_models(monkeypatch):
    """Unit tests never load the embedding / reranker models; test_retrieval.py stubs the search."""
    from app import config
    monkeypatch.setattr(config, "RETRIEVAL_ENABLED", False)
