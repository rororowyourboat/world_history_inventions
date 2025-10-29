#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print(f"\n{'='*60}")
        print(f"  Timeline of Historic Inventions - Local Server")
        print(f"{'='*60}")
        print(f"\n  Server running at: {url}")
        print(f"\n  Instructions:")
        print(f"  1. Open your browser and navigate to the URL above")
        print(f"  2. Scroll down to travel through time")
        print(f"  3. Hover over red dots to see invention details")
        print(f"\n  Press Ctrl+C to stop the server")
        print(f"{'='*60}\n")
        
        try:
            webbrowser.open(url)
        except:
            print("  Could not auto-open browser. Please open manually.")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")

if __name__ == "__main__":
    start_server()
