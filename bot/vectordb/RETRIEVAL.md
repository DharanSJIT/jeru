# Retrieval: chunking, hybrid search, reranking

Thittam answers questions like *"any help to build a house?"*, *"விதவை ஓய்வூதியம்"* (widow pension) or *"what documents for PM-KISAN?"*. Retrieval decides **which schemes and which section** the answer should come from. It never decides eligibility: that always comes from the rule engine (`server/app/engine/rules.py`).

**Run the walkthrough:** double-click `PROJECT_BOT/retrieval_demo.bat`, or run:

```bash
cd PROJECT_BOT
.venv/Scripts/python -m vectordb.demo                          # chunking + pipeline + evaluation
.venv/Scripts/python -m vectordb.demo --part pipeline -q "pension for my mother"
```

## 1. Chunking: structure-aware parents, recursive children

| Level | Unit | Why |
|---|---|---|
| **Parent** | one scheme × one section (`overview`, `eligibility`, `documents`, `how_to_apply`) × one language (en/ta) | A question almost always targets one section: "documents for X" should land on X's documents, not X's overview |
| **Child** | the parent split by a **recursive character splitter** (`vectordb/chunking.py`) | Keeps chunks small and focused, so a fragment on its own still makes sense |

- **How the splitter works.** It tries the coarsest boundary first: `\n\n` → `\n` → `. ` → `। ` → `; ` → `, ` → space → characters. A piece that's still too long is split again with the next boundary. Pieces that fit are merged back up to `CHUNK_SIZE` (300 characters), and `CHUNK_OVERLAP` (60 characters) carries into the next chunk, so a fact that falls on a boundary appears whole at least once. `"1. "` is not treated as a sentence break, so numbered steps stay with their text.
- **Each parent is written one fact per line**: one line per eligibility rule, per document and per application step. The splitter's first choice of boundary is therefore always a real one.
- **Every child starts with a header** like `PM-KISAN | How to apply`. Without it, a chunk such as "3. Complete e-KYC" wouldn't say which scheme it belongs to.
- **Search ranks children; the answer gets the parent.** The best child wins, its en/ta twins and siblings are collapsed, and the whole parent section is passed on as context. The context is given in the user's language whenever that version exists.

Corpus: 30 schemes → 180 parent sections → 182 children. The catalogue is concise, so most sections fit in a single chunk. The splitter matters as soon as longer text, such as scheme guideline PDFs, is added. The demo stress-tests it at 60 characters to show the recursion and the overlap.

## 2. Retrieval: hybrid recall, then precise reranking

```
query ─┬─► A dense   paraphrase-multilingual-MiniLM-L12-v2 (cosine) ── top 30 ─┐
       └─► B sparse  BM25 over words + character 4-grams ────────────── top 30 ─┴─► C RRF fusion ─► D cross-encoder rerank ─► collapse to sections
                                                                                   Σ 1/(60+rank)     jina-reranker-v2-base-multilingual
```

| Stage | What it catches | What it misses alone |
|---|---|---|
| **A: dense** | Paraphrases ("concrete house" ≈ "pucca house") | Tamil: the model isn't trained on Tamil, so "விதவை ஓய்வூதியம்" returns health schemes |
| **B: BM25 + 4-grams** | Exact names ("PM-KISAN"), numbers, Tamil word forms (ஓய்வூதியம் / ஓய்வூதியத்தை share 4-grams) | Meaning: "housing for poor families" |
| **C: RRF** | Items ranked well by *either* stage. Rank-based, so no score calibration is needed | Fine ordering |
| **D: cross-encoder** | Reads the query and the chunk *together*, in any language, so it catches the right match that stage C ranked lower | Too slow to run over the whole corpus, so it only sees C's top 30 |

## 3. Results (`python -m vectordb.demo --part eval`)

30 queries in English, Tamil and Hindi, both keyword-style and paraphrased (`vectordb/eval_queries.json`). A query counts as correct when the right scheme comes first.

| System | hit@1 | hit@3 | MRR | ms/query (CPU) |
|---|---|---|---|---|
| A: dense only | 83% | 90% | 0.88 | 18 |
| B: BM25 only | 80% | 97% | 0.88 | <1 |
| C: hybrid (RRF) | 93% | 97% | 0.95 | 7 |
| **D: hybrid + rerank** | **100%** | **100%** | **1.00** | ~2,300 |

Section intent: 3/3. For example, "what documents do I need for PM-KISAN" puts `pm_kisan:documents` first.

## 4. In the product

`server/app/agents/retrieval.py`, called from `orchestrator.chat()` when the extractor detects a scheme question:

1. **The user named a scheme** and asked something specific: the extractor's pick is kept.
2. **The question is broad or names no scheme** ("any help for a house?"): the reranked schemes are used, those scoring at least `RETRIEVAL_MIN_SCORE` (0.3).
3. **The topic is "general"**: it's refined to the best hit's section (documents, eligibility or how to apply).
4. **Passages go to the answerer.** The matched parent sections are sent to the answerer as `retrieved_passages`. These are excerpts of the same catalogue records, so it still can't invent facts.
5. **Every stage is visible** in the turn trace (`"step": "retrieve"`: dense rank, BM25 rank, RRF, reranker score), and live at `GET /api/search?q=...`.

**Fallbacks.** Retrieval has a 4-second timeout. If it's off (`RETRIEVAL_ENABLED=0`), the models are missing, or it times out, the extractor's pick is used exactly as before. The models load in the background at server startup, which takes about 10 seconds.

**Milvus (optional).** `docker compose up -d`, then `python -m vectordb.ingest`, loads the same chunks into Milvus with the same schema, for when the catalogue outgrows memory. `vectordb.search` uses Milvus when it's reachable and falls back to in-memory search. The server always uses in-memory search, which takes milliseconds for 182 chunks.

## Talk track (60 seconds)

> "Scheme questions come in three languages and many phrasings, so we don't rely on one retriever.
> **Chunking**: every scheme becomes sections (overview, eligibility, documents, how to apply) in English and Tamil. Each section is split recursively, on lines first, then sentences, then words, with overlap. Every chunk carries a scheme-and-section header, so it never loses its subject.
> **Recall**: we run a multilingual dense model *and* BM25 with character n-grams in parallel. Here, the Tamil query 'widow pension': dense alone returns health schemes, because the model is weak on Tamil, but BM25 finds it. Reciprocal rank fusion merges the two lists.
> **Precision**: a multilingual cross-encoder reranks the top 30 by reading the question and the chunk together.
> On 30 test queries, the right scheme comes first 83% of the time with dense alone, 93% with the hybrid, and 100% after reranking.
> Retrieval only chooses *what to talk about*. Eligibility still comes from our rule engine, and if retrieval fails, the bot falls back to the old path."
