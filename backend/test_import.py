# Test script
try:
    from main import app
    print("Backend imports OK - app:", app.title)
except Exception as e:
    print("Error:", e)
    import traceback
    traceback.print_exc()
