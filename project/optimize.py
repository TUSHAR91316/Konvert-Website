import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update readme_icon.png to readme_icon.webp
    content = content.replace('readme_icon.png', 'readme_icon.webp')

    # 2. Update clean URLs
    # Replace href="index.html" with href="/"
    content = content.replace('href="index.html"', 'href="/"')
    
    # Replace other .html links
    # Match href="some-page.html"
    content = re.sub(r'href="([^"]+)\.html"', r'href="\1"', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        process_file(filename)
