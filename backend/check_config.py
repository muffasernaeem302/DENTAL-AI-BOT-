import sys
print(f"Python version: {sys.version}")
try:
    from core.config import settings
    print(f"App name: {settings.app_name}")
    print(f"Database URL: {settings.database_url}")
except Exception as e:
    print(f"Error loading config: {e}")
    import traceback
    traceback.print_exc()
