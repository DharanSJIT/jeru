@echo off
REM One-click demo launcher: opens the API server and the Telegram bot in two windows.
REM First time only:  python -m venv .venv  &&  .venv\Scripts\pip install -r server\requirements.txt -r requirements.txt
cd /d "%~dp0"
if not exist .venv\Scripts\python.exe (
  echo [!] .venv not found. Run the first-time setup in README.md
  pause
  exit /b 1
)
if not exist .env (
  echo [!] .env not found. Copy .env.example to .env and fill in the keys.
  pause
  exit /b 1
)
start "Thittam SERVER" cmd /k "cd /d %~dp0server && ..\.venv\Scripts\python -m uvicorn app.main:app --port 8000"
timeout /t 4 /nobreak >nul
start "Thittam BOT" cmd /k "cd /d %~dp0 && .venv\Scripts\python -m bot.main"
echo Server: http://localhost:8000/api/health
echo Bot:    https://t.me/jce_hackathon_bot
