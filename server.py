#!/usr/bin/env python3
"""
Custom HTTP Server with URL Rewriting Support
This server handles clean URLs (without .html extension) by automatically
adding .html extension when the file exists.
"""

import http.server
import socketserver
import os
import urllib.parse
from pathlib import Path

class URLRewriteHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP Request Handler with URL rewriting support"""
    
    def do_GET(self):
        """Handle GET requests with URL rewriting"""
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]
        
        # If path is empty, serve index.html
        if path == '' or path == '/':
            path = 'index.html'
        
        # Check if the path exists as-is
        if os.path.exists(path) and os.path.isfile(path):
            # File exists, serve it normally
            super().do_GET()
            return
        
        # Check if path.html exists
        html_path = path + '.html'
        if os.path.exists(html_path) and os.path.isfile(html_path):
            # Rewrite the path to include .html
            self.path = '/' + html_path + ('?' + parsed_path.query if parsed_path.query else '')
            super().do_GET()
            return
        
        # Check if it's a directory and index.html exists
        if os.path.isdir(path):
            index_path = os.path.join(path, 'index.html')
            if os.path.exists(index_path):
                self.path = '/' + index_path + ('?' + parsed_path.query if parsed_path.query else '')
                super().do_GET()
                return
        
        # File not found, return 404
        self.send_error(404, "File not found")
    
    def end_headers(self):
        """Add security headers"""
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()

def run_server(port=8000):
    """Run the HTTP server on the specified port"""
    handler = URLRewriteHTTPRequestHandler
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Server running at http://localhost:{port}/")
        print(f"Server running at http://127.0.0.1:{port}/")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    import sys
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number: {sys.argv[1]}")
            print("Usage: python server.py [port]")
            sys.exit(1)
    
    run_server(port)

