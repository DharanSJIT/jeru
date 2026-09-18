@echo off
REM Judge walkthrough: chunking -> hybrid retrieval -> reranking -> evaluation. Args pass through,
REM e.g.  retrieval_demo.bat --part pipeline -q "widow pension"
cd /d "%~dp0"
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
.venv\Scripts\python -m vectordb.demo %*
pause
