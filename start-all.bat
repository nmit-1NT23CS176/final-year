@echo off
REM ═══════════════════════════════════════════════════════════════
REM   Financial Market Trend Forecasting System — Start All
REM   Launches Redis, ML Core (8000), Server (5000), Client (3000)
REM ═══════════════════════════════════════════════════════════════

title FMF — Launcher

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║   Financial Market Trend Forecasting System             ║
echo  ║   Starting all services...                              ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

REM ── 0. Redis (Docker on port 6379) ─────────────────────────────
echo [0/3] Starting Redis via Docker...
docker start redis 2>nul || docker run -d --name redis -p 6379:6379 redis:latest
echo       Redis running on port 6379
echo.

REM ── 1. ML Core (FastAPI on port 8000) ──────────────────────────
echo [1/3] Starting ML Core (FastAPI) on port 8000...
start "ML Core - FastAPI :8000" cmd /k "cd /d %~dp0ml_core\ml_pipeline && call C:\fmf-venv\Scripts\activate && python app.py"

REM Give ML Core a moment to initialize
timeout /t 3 /nobreak > nul

REM ── 2. Server (Express on port 5000) ───────────────────────────
echo [2/3] Starting Server (Express) on port 5000...
start "Server - Express :5000" cmd /k "cd /d %~dp0server && npm run dev"

REM ── 3. Client (Next.js on port 3000) ───────────────────────────
echo [3/3] Starting Client (Next.js) on port 3000...
start "Client - Next.js :3000" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo  ✅ All services launched!
echo.
echo  ┌─────────────────────────────────────────────────────────┐
echo  │  Redis    (Docker)    →  localhost:6379                  │
echo  │  ML Core  (FastAPI)   →  http://localhost:8000           │
echo  │  Server   (Express)   →  http://localhost:5000           │
echo  │  Client   (Next.js)   →  http://localhost:3000           │
echo  └─────────────────────────────────────────────────────────┘
echo.
echo  Close this window or press any key to exit the launcher.
echo  (The 3 service windows will keep running independently.)
echo.
pause
