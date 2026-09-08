#!/usr/bin/env python3
"""Start the backend server in background."""
import subprocess
import sys
import os

# Change to backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print("Starting backend server in background...")

# Start the server
process = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

print(f"Started process with PID: {process.pid}")
print("Waiting for server to start...")

import time
time.sleep(3)

# Check if process is still running
if process.poll() is None:
    print("Server is running!")
else:
    stdout, stderr = process.communicate()
    print(f"Server exited with code: {process.returncode}")
    print(f"STDOUT: {stdout}")
    print(f"STDERR: {stderr}")
