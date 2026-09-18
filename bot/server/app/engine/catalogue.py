"""Load and validate the scheme catalogue (data/schemes.json). Fails loudly on bad data."""
from __future__ import annotations

import json
from pathlib import Path

from ..fields import DERIVED, FIELDS, UI

DATA = Path(__file__).resolve().parents[2] / "data" / "schemes.json"
OPS = {"eq", "ne", "in", "not_in", "lt", "lte", "gt", "gte", "between", "is_true", "is_false"}
KNOWN_FIELDS = set(FIELDS) | set(DERIVED)


class CatalogueError(ValueError):
    pass


def _check_cond(sid: str, cond: dict):
    if cond.get("field") not in KNOWN_FIELDS:
        raise CatalogueError(f"scheme '{sid}': unknown field '{cond.get('field')}'")
    if cond.get("op") not in OPS:
        raise CatalogueError(f"scheme '{sid}': unknown op '{cond.get('op')}'")
    if cond["op"] == "between" and not (isinstance(cond.get("value"), list) and len(cond["value"]) == 2):
        raise CatalogueError(f"scheme '{sid}': 'between' needs [lo, hi]")
    if cond["op"] not in ("is_true", "is_false") and "value" not in cond:
        raise CatalogueError(f"scheme '{sid}': op '{cond['op']}' needs a value")


def load_schemes(path: Path = DATA) -> list[dict]:
    schemes = json.loads(path.read_text(encoding="utf-8"))
    ids = set()
    for s in schemes:
        sid = s.get("id")
        if not sid or sid in ids:
            raise CatalogueError(f"missing or duplicate scheme id: {sid!r}")
        ids.add(sid)
        for key in ("name", "benefit", "eligibility", "documents", "application", "source_url"):
            if key not in s:
                raise CatalogueError(f"scheme '{sid}': missing '{key}'")
        elig = s["eligibility"]
        for block in ("all", "any", "none"):
            elig.setdefault(block, [])
            for cond in elig[block]:
                _check_cond(sid, cond)
        if s.get("state"):
            elig["all"].insert(0, {"field": "state", "op": "eq", "value": s["state"], "text": UI["lives_in_tn"]})
        s.setdefault("category", [])
        s.setdefault("mutually_exclusive_with", [])
        s.setdefault("unverified", True)
    for s in schemes:
        for other in s["mutually_exclusive_with"]:
            if other not in ids:
                raise CatalogueError(f"scheme '{s['id']}': mutually_exclusive_with unknown '{other}'")
    return schemes
