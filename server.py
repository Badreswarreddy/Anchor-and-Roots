#!/usr/bin/env python3
"""
Anchor & Roots - Local Development & Persistence Server
Zero external dependencies, runs directly on Python 3.
Provides:
  - Static file serving (HTML, CSS, JS, Images, Video)
  - GET  /api/data  -> Returns data.json contents
  - POST /api/data  -> Saves changes directly to data.json on disk!
"""

import http.server
import socketserver
import json
import os
import sys

PORT = 8000
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data.json')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local testing if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/data':
            if os.path.exists(DATA_FILE):
                try:
                    with open(DATA_FILE, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))
                    return
                except Exception as e:
                    self.send_response(500)
                    self.end_headers()
                    self.wfile.write(f'{{"error": "{str(e)}"}}'.encode('utf-8'))
                    return
            else:
                self.send_response(404)
                self.end_headers()
                return

        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/data':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode('utf-8')
                new_data = json.loads(body)
                
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(new_data, f, indent=2, ensure_ascii=False)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status": "success", "message": "Saved to data.json"}')
                print("[Server] Successfully updated data.json from client!")
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(f'{{"status": "error", "message": "{str(e)}"}}'.encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print("=" * 65)
        print(f" Anchor & Roots Server running at: http://localhost:{PORT}")
        print(f" Admin Panel / Data persistent to: {DATA_FILE}")
        print(" Press Ctrl+C to stop the server.")
        print("=" * 65)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()

if __name__ == '__main__':
    run_server()
