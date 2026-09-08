#!/usr/bin/env python3
"""Test the init_db function."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Testing init_db...")

try:
    from database import init_db
    print("Running init_db...")
    asyncio.run(init_db())
    print("init_db completed successfully!")
except Exception as e:
    print(f"ERROR in init_db: {e}")
    import traceback
    traceback.print_exc()
