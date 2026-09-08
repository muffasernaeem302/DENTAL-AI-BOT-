# Start both Backend and Frontend servers
$ErrorActionPreference = "Stop"

Write-Host "=========================================="
Write-Host "  DentalAI - Starting Application"
Write-Host "=========================================="

# Kill any existing processes on these ports
Write-Host "Checking for existing processes..."
$existingBackend = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
$existingFrontend = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($existingBackend) {
    Write-Host "Stopping existing backend on port 8000..."
    Stop-Process -Id $existingBackend.OwningProcess -Force -ErrorAction SilentlyContinue
}

if ($existingFrontend) {
    Write-Host "Stopping existing frontend on port 5173..."
    Stop-Process -Id $existingFrontend.OwningProcess -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 1

# Start Backend
Write-Host "Starting Backend Server (FastAPI on port 8000)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'e:\DENTAL AI AGENT\backend'; python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000" -WindowStyle Normal

# Start Frontend
Write-Host "Starting Frontend Server (Vite on port 5173)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'e:\DENTAL AI AGENT\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "=========================================="
Write-Host "  DentalAI is starting!"
Write-Host "  - Backend: http://127.0.0.1:8000"
Write-Host "  - Frontend: http://127.0.0.1:5173"
Write-Host "  - API Docs: http://127.0.0.1:8000/docs"
Write-Host "=========================================="
Write-Host ""
Write-Host "Press Ctrl+C in the server windows to stop, or close this window."

# Wait for servers to start
Start-Sleep -Seconds 5

# Check if servers are running
$backendRunning = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
$frontendRunning = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($backendRunning) {
    Write-Host "[OK] Backend is running on port 8000"
} else {
    Write-Host "[WARNING] Backend may not have started. Check the backend window."
}

if ($frontendRunning) {
    Write-Host "[OK] Frontend is running on port 5173"
} else {
    Write-Host "[WARNING] Frontend may not have started. Check the frontend window."
}
