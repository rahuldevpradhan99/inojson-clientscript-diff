#!/usr/bin/env python3
"""
Simple zero-dependency HTTP server for InoJson Diff Studio
Runs locally and automatically opens in browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching disabled for active dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run():
    port = PORT
    while True:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}"
                print("=" * 60)
                print(f"🚀 InoJson Script Compare & Diff Studio is running!")
                print(f"📍 Local URL: {url}")
                print(f"📂 Serving:   {DIRECTORY}")
                print("=" * 60)
                print("Press Ctrl+C to stop the server.")
                
                try:
                    webbrowser.open(url)
                except Exception:
                    pass
                
                httpd.serve_forever()
        except OSError as e:
            if e.errno == 48: # Address already in use
                port += 1
                continue
            else:
                raise e

if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
