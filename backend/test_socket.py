#!/usr/bin/env python3
import socket
import os

print(f"Working directory: {os.getcwd()}")
print(f"Starting socket server on port 8000...")

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(('127.0.0.1', 8000))
server.listen(1)

print(f"Server listening on 127.0.0.1:8000")
print(f"PID: {os.getpid()}")

# Accept connection
conn, addr = server.accept()
print(f"Connection from {addr}")
conn.send(b"Hello from socket server!")
conn.close()
server.close()
print("Server done")
