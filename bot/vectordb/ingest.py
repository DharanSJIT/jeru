"""(Re)build the Milvus collection from the scheme catalogue.

    python -m vectordb.ingest            # needs Milvus at MILVUS_URI (docker compose up -d)
    python -m vectordb.ingest --dry-run  # no Milvus: just show the chunks that would be inserted
"""
from __future__ import annotations

import argparse
import sys
from collections import Counter

from . import config
from .docs import all_chunks
from .embed import get_embedder


def connect():
    from pymilvus import MilvusClient
    return MilvusClient(uri=config.MILVUS_URI, token=config.MILVUS_TOKEN or None)


def create_collection(client, dim: int) -> None:
    from pymilvus import DataType
    if client.has_collection(config.COLLECTION):
        client.drop_collection(config.COLLECTION)
    schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
    schema.add_field("id", DataType.VARCHAR, is_primary=True, max_length=128)
    schema.add_field("scheme_id", DataType.VARCHAR, max_length=64)
    schema.add_field("parent_id", DataType.VARCHAR, max_length=128)
    schema.add_field("section", DataType.VARCHAR, max_length=32)
    schema.add_field("lang", DataType.VARCHAR, max_length=8)
    schema.add_field("level", DataType.VARCHAR, max_length=16)
    schema.add_field("category", DataType.VARCHAR, max_length=256)
    schema.add_field("text", DataType.VARCHAR, max_length=8192)  # bytes; Tamil is 3 bytes/char
    schema.add_field("vector", DataType.FLOAT_VECTOR, dim=dim)
    index = client.prepare_index_params()
    index.add_index(field_name="vector", index_type="AUTOINDEX", metric_type="COSINE")
    client.create_collection(config.COLLECTION, schema=schema, index_params=index)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="print chunks, do not touch Milvus")
    args = ap.parse_args()

    chunks = all_chunks()
    stats = Counter((c["section"], c["lang"]) for c in chunks)
    print(f"{len(chunks)} chunks from {len({c['scheme_id'] for c in chunks})} schemes")
    for (section, lang), n in sorted(stats.items()):
        print(f"  {section:13} {lang}: {n}")
    if args.dry_run:
        for c in chunks[:4]:
            print(f"\n[{c['id']}] {c['text']}")
        return 0

    embedder = get_embedder()
    print(f"embedder: {embedder.name} (dim={embedder.dim})")
    try:
        client = connect()
        create_collection(client, embedder.dim)
    except Exception as e:  # server not running, Lite unsupported on Windows, ...
        print(f"\nCannot reach Milvus at {config.MILVUS_URI}: {e}\n"
              "Start it with:  cd PROJECT_BOT/vectordb && docker compose up -d   (wait ~60 s)", file=sys.stderr)
        return 1
    vectors = embedder.embed([c["text"] for c in chunks])
    rows = [{**c, "vector": v} for c, v in zip(chunks, vectors)]
    client.insert(config.COLLECTION, rows)
    client.flush(config.COLLECTION)  # seal segments so row_count / Attu show the data
    print(f"\nInserted {len(rows)} rows into '{config.COLLECTION}' at {config.MILVUS_URI} (dim={embedder.dim})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
