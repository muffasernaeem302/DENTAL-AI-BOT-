# Start Backend Server
$ErrorActionPreference = "Stop"
Set-Location "e:\DENTAL AI AGENT\backend"
Write-Host "Starting Backend Server on port 8000..."
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
