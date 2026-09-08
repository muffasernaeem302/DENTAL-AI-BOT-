@echo off
cd /d "%~dp0"
echo Starting server from: %CD%
python test_socket.py
pause
