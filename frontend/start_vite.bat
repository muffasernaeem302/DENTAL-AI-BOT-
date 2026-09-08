@echo off
cd /d "%~dp0"
echo Starting Vite dev server from: %CD%
node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173
pause
