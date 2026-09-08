#!/usr/bin/env python3
"""Simple HTTP server test with explicit directory."""
import os
import http.server
import socketserver
import socket

# Change to backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(f"Working directory: {os.getcwd()}")

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'Hello from simple HTTP server!')
    
    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format%args}")

def check_port(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    try:
        result = sock.connect_ex(('127.0.0.1', port))
        sock.close()
        return result == 0
    except:
        return False

Handler.extensions_map['.html'] = 'text/html'

with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Serving at http://127.0.0.1:{PORT}")
    print(f"Checking if port is available...")
    httpd.allow_reuse_address = True
    print("Server ready, calling serve_forever()")
    httpd.serve_forever()
