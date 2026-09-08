#!/usr/bin/env python3
"""Test uvicorn with a minimal app."""
import sys
import os

print("Python:", sys.version)
print("Starting minimal test server...")

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "ok"}

@app.get("/health")
async def health():
    return {"health": "ok"}

if __name__ == "__main__":
    import uvicorn
    print("Starting uvicorn on port 8000...")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="debug")
