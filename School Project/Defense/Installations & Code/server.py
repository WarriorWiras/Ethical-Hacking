#!/usr/bin/env python3
import socket

HOST = '0.0.0.0'  # Listen on all interfaces
PORT = 9001

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((HOST, PORT))
s.listen(1)
print(f"Listening on {HOST}:{PORT}")

conn, addr = s.accept()
print(f"Connection from {addr}")

try:
    while True:
        cmd = input("Enter Python command: ")
        if cmd.lower() in ("exit", "quit"):
            conn.send(b"exit\n")
            break
        conn.send(cmd.encode() + b"\n")
        result = conn.recv(4096)
        print(result.decode().strip())
except KeyboardInterrupt:
    print("Server shutting down.")
finally:
    conn.close()
    s.close()
