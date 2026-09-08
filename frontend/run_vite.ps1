# Run vite dev server and capture output
$ErrorActionPreference = "Continue"

Write-Host "Starting Vite dev server..."
Write-Host "Working directory: $(Get-Location)"

try {
    $process = Start-Process -FilePath "node" -ArgumentList "node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "5173" -PassThru -NoNewWindow -Wait -RedirectStandardOutput "vite_out.txt" -RedirectStandardError "vite_err.txt"
    
    Write-Host "Process exited with code: $($process.ExitCode)"
    
    if (Test-Path "vite_out.txt") {
        Write-Host "STDOUT:"
        Get-Content "vite_out.txt"
    }
    
    if (Test-Path "vite_err.txt") {
        Write-Host "STDERR:"
        Get-Content "vite_err.txt"
    }
} catch {
    Write-Host "Error: $_"
}
