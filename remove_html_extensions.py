#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to remove .html extensions from all internal links in HTML files
This makes URLs cleaner and more professional (e.g., /contacts instead of /contacts.html)
"""

import os
import re
from pathlib import Path

def remove_html_from_links(content):
    """
    Remove .html extension from href attributes in HTML content
    Handles various formats:
    - href="page.html"
    - href='page.html'
    - href=page.html
    - href="./page.html"
    - href="../page.html"
    """
    # Pattern to match href attributes with .html files
    # Matches: href="xxx.html", href='xxx.html', href=xxx.html, etc.
    patterns = [
        # Standard href="xxx.html" or href='xxx.html'
        (r'href=["\']([^"\']+)\.html["\']', r'href="\1"'),
        # href=xxx.html (without quotes)
        (r'href=([^\s>]+)\.html([\s>])', r'href=\1\2'),
        # Action attributes in forms
        (r'action=["\']([^"\']+)\.html["\']', r'action="\1"'),
    ]
    
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)
    
    return content

def process_html_file(file_path):
    """Process a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = remove_html_from_links(content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all HTML files"""
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    html_files = list(script_dir.glob('*.html'))
    
    # Exclude temporary files
    html_files = [f for f in html_files if not f.name.endswith('.tmp')]
    
    print(f"Found {len(html_files)} HTML files to process...")
    
    modified_count = 0
    for html_file in html_files:
        if process_html_file(html_file):
            print(f"[OK] Updated: {html_file.name}")
            modified_count += 1
        else:
            print(f"[--] No changes: {html_file.name}")
    
    print(f"\n[OK] Process complete! Modified {modified_count} files.")
    print("\nNext steps:")
    print("1. Upload the .htaccess file to your server root")
    print("2. Ensure mod_rewrite is enabled on your Apache server")
    print("3. Test the URLs (e.g., https://www.esic.edu.sg/contacts)")

if __name__ == '__main__':
    main()

