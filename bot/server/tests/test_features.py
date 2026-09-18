"""Feature tests: tap-friendly questions (#4) and scheme Q&A (#1). No network needed."""
import pytest
from fastapi.testclient import TestClient

from app import config, orchestrator
from app.agents import answerer, extractor, llm
from app.engine.planner import question_payload
from app.main import app


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setattr(config, "GROQ_API_KEY", "")
    return TestClient(app)


# ---------- #4 buttons ----------

def test_occupation_has_buttons_in_tamil():
    q = question_payload("occupation", "ta")
    assert q["input_type"] == "enum"
    labels = [o["label"] for o in q["options"]]
    assert "விவசாயக் கூலித் தொழிலாளி" in labels and "தெரியாது" in labels
    assert len(q["options"]) <= 10


def test_disability_percent_has_range_buttons():
    q = question_payload("disability_percent", "en")
    assert q["input_type"] == "enum"
    assert [o["value"] for o in q["options"]][:3] == [30, 60, 85]


# a profile where only disability decides the disability pension (igndps)
BASE = {"age": 50, "gender": "male", "state": "TN", "annual_family_income": 50000, "has_bpl_ration_card": True,
        "occupation": "daily_wage_labourer", "marital_status": "married", "residence": "urban",
        "has_pucca_house": True, "is_epfo_member": False, "owns_house": True, "has_electricity_connection": True,
        "wants_to_start_business": False, "children": [], "caste_category": "bc"}


def _session(sid):
    from app.session import Session
    return Session(id=sid, profile=dict(BASE))


@pytest.mark.anyio
async def test_disability_asks_yes_no_first_and_no_resolves_pension(client):
    s = _session("dis-no")
    r = await orchestrator.answer(s, "age", 50, "en")
    assert r["next_question"]["field"] == "has_disability"  # yes/no gate, not the percentage
    assert r["next_question"]["input_type"] == "bool"
    r = await orchestrator.answer(s, "has_disability", False, "en")
    assert r["profile"]["disability_percent"] == 0
    assert any(x["scheme_id"] == "igndps" for x in r["results"]["not_eligible"])
    assert r["next_question"] is None or r["next_question"]["field"] != "disability_percent"


@pytest.mark.anyio
async def test_disability_yes_then_range_button(client):
    s = _session("dis-yes")
    await orchestrator.answer(s, "age", 50, "en")
    r = await orchestrator.answer(s, "has_disability", True, "en")
    assert r["next_question"]["field"] == "disability_percent"
    assert r["next_question"]["input_type"] == "enum"
    r = await orchestrator.answer(s, "disability_percent", 85, "en")
    assert any(x["scheme_id"] == "igndps" for x in r["results"]["likely"])
    view = {p["field"]: p["display"] for p in r["profile_view"]}
    assert view["disability_percent"] == "80% or more"


@pytest.mark.anyio
async def test_ignored_gate_does_not_fall_through_to_percentage(client):
    s = _session("dis-ignored")
    s.asked["has_disability"] = 2
    r = await orchestrator.answer(s, "age", 50, "en")
    assert r["next_question"] is None or r["next_question"]["field"] not in ("has_disability", "disability_percent")


# ---------- #1 scheme Q&A ----------

@pytest.mark.anyio
async def test_scheme_question_uses_template_when_llm_fails(monkeypatch):
    monkeypatch.setattr(llm, "available", lambda: True)

    async def fake_extract(*a, **k):
        return [], {"scheme_ids": ["kmut"], "topic": "documents"}

    async def boom(**k):
        raise llm.LLMError("down")

    monkeypatch.setattr(extractor, "extract", fake_extract)
    monkeypatch.setattr(answerer, "answer", boom)
    from app.session import Session
    s = Session(id="qa")
    r = await orchestrator.chat(s, "KMUT-க்கு என்ன ஆவணம் வேணும்?", "ta", "telegram")
    assert r["answered_schemes"] == ["kmut"]
    assert "கலைஞர் மகளிர் உரிமைத் தொகை" in r["reply"]
    assert "ஆதார் அட்டை" in r["reply"]           # documents come from the catalogue record
    assert r["next_question"]["text"] in r["reply"]  # interview continues after the answer


@pytest.fixture
def anyio_backend():
    return "asyncio"
