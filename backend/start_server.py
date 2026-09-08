#!/usr/bin/env python3
"""Simple script to start the backend server."""
import sys
import os

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Starting DentalAI Backend Server...")
print(f"Python: {sys.version}")
print(f"Working directory: {os.getcwd()}")

try:
    # Test imports
    print("Testing imports...")
    from main import app
    print(f"App loaded: {app.title}")
    
    # Start server
    print("Starting uvicorn server on http://127.0.0.1:8000")
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    input("Press Enter to exit...")
