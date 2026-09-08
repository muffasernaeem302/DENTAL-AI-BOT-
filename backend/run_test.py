#!/usr/bin/env python3
"""Import test."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Importing test_fastapi...")
import test_fastapi
print("App:", test_fastapi.app)
print("OK!")
