#!/usr/bin/env python3
"""Simple HTTP server test with chdir."""
import os
import sys
import http.server
import socketserver
import socket

# Change to backend directory using absolute path
backend_dir = r"e:\DENTAL AI AGENT\backend"
os.chdir(backend_dir)
print(f"Working directory: {os.getcwd()}")
print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'Hello from simple HTTP server!')
    
    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format%args}")

Handler.extensions_map['.html'] = 'text/html'

print(f"Creating TCPServer on 127.0.0.1:{PORT}")
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    httpd.allow_reuse_address = True
    print(f"Server created. Serving at http://127.0.0.1:{PORT}")
    sys.stdout.flush()
    httpd.serve_forever()
