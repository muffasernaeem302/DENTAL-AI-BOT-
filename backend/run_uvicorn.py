#!/usr/bin/env python3
"""Run uvicorn and capture output."""
import sys
import os
import time
import threading
import socket

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def check_port(host, port):
    """Check if a port is listening."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    try:
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

print("=" * 50)
print("Testing uvicorn startup")
print("=" * 50)

# Import app
from test_fastapi import app
import uvicorn

print(f"App: {app}")
print(f"App title: {app.title}")

# Create uvicorn config
config = uvicorn.Config(
    app,
    host="127.0.0.1",
    port=8000,
    log_level="debug",
)

print("Config created")
print(f"Host: {config.host}")
print(f"Port: {config.port}")

# Create server
server = uvicorn.Server(config)
print("Server created")

# Start server in thread
def run_server():
    print("Starting server...")
    server.run()
    print("Server stopped")

thread = threading.Thread(target=run_server, daemon=True)
thread.start()

print("Thread started, waiting for server...")
time.sleep(2)

# Check if port is listening
if check_port("127.0.0.1", 8000):
    print("SUCCESS: Server is listening on port 8000!")
else:
    print("ERROR: Server is NOT listening on port 8000")
    
# Keep thread alive
print("Keeping process alive...")
time.sleep(10)
