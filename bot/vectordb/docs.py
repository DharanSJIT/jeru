"""Turn server/data/schemes.json into retrievable chunks.

Two levels (parent / child):
  parent = one section of one scheme in one language (overview, eligibility, documents, how_to_apply),
           laid out one fact per line so the splitter has clean boundaries;
  child  = recursive split of the parent body (config.CHUNK_SIZE / CHUNK_OVERLAP), each prefixed with a
           "<scheme> | <section>" header so a lone fragment still says what it is about.
Children are what gets embedded and ranked; the parent text is returned as context.
"""
from __future__ import annotations

import json
from pathlib import Path

from . import config
from .chunking import recursive_split
from .config import SCHEMES_PATH

SECTIONS = ("overview", "eligibility", "documents", "how_to_apply")
LANGS = ("en", "ta", "hi")
_LABEL = {"overview": "Overview", "eligibility": "Eligibility", "documents": "Documents needed",
          "how_to_apply": "How to apply"}

_OPS = {"eq": "is", "ne": "is not", "in": "is one of", "not_in": "is not one of", "lt": "<", "lte": "<=",
        "gt": ">", "gte": ">=", "between": "between", "is_true": "is yes", "is_false": "is no"}


def _loc(d, lang: str):
    if isinstance(d, dict):
        return d.get(lang)
    return d if lang == "en" else None


def _cond(c: dict) -> str:
    if any(k in c for k in ("all", "any", "none")):
        return "(" + "; ".join(_block(c)) + ")"
    field = c["field"].replace("_", " ")
    val = c.get("value")
    if isinstance(val, list):
        val = " and ".join(map(str, val)) if c["op"] == "between" else ", ".join(map(str, val))
    return f"{field} {_OPS.get(c['op'], c['op'])}" + ("" if val is None else f" {val}")


def _block(e: dict) -> list[str]:
    """One line per rule group."""
    lines = [f"- {_cond(c)}" for c in e.get("all", [])]
    if e.get("any"):
        lines.append("- at least one of: " + " OR ".join(_cond(c) for c in e["any"]))
    if e.get("none"):
        lines.append("- must NOT: " + " OR ".join(_cond(c) for c in e["none"]))
    return lines


def load_schemes(path: Path = SCHEMES_PATH) -> list[dict]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def scheme_sections(s: dict) -> list[dict]:
    """Parent documents for one scheme."""
    out = []
    base = {"scheme_id": s["id"], "level": s.get("level") or "", "category": ",".join(s.get("category", []))}
    app = s.get("application", {})
    for lang in LANGS:
        name = _loc(s["name"], lang)
        if not name:
            continue
        body: dict[str, str] = {}
        benefit = _loc(s.get("benefit", {}).get("summary"), lang)
        if benefit:
            body["overview"] = f"{benefit}.\nCategories: {base['category'].replace(',', ', ').replace('_', ' ')}."
        if lang == "en":  # rules and document ids are English-only in the catalogue
            rules = _block(s.get("eligibility", {}))
            if rules:
                body["eligibility"] = "\n".join(rules)
            if s.get("documents"):
                body["documents"] = "\n".join(f"- {d.replace('_', ' ')}" for d in s["documents"])
        where = _loc(app.get("where"), lang)
        steps = _loc(app.get("steps"), lang) or []
        if where or steps:
            head = f"Mode: {app.get('mode', '')}. Where: {where}." if where else f"Mode: {app.get('mode', '')}."
            body["how_to_apply"] = "\n".join([head] + [f"{i}. {st}" for i, st in enumerate(steps, 1)])
        for section, text in body.items():
            out.append({**base, "id": f"{s['id']}#{section}#{lang}", "section": section, "lang": lang,
                        "name": name, "text": text})
    return out


def split_section(p: dict) -> list[dict]:
    header = f"{p['name']} | {_LABEL[p['section']]}\n"
    pieces = recursive_split(p["text"], config.CHUNK_SIZE, config.CHUNK_OVERLAP)
    return [{k: p[k] for k in ("scheme_id", "level", "category", "section", "lang")}
            | {"id": f"{p['id']}#{i}", "parent_id": p["id"], "text": (header + piece)[:2000]}
            for i, piece in enumerate(pieces)]


def all_sections(path: Path = SCHEMES_PATH) -> list[dict]:
    return [p for s in load_schemes(path) for p in scheme_sections(s)]


def all_chunks(path: Path = SCHEMES_PATH) -> list[dict]:
    return [c for p in all_sections(path) for c in split_section(p)]
