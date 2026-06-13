import os

targets = ['roadmap', 'self-hosting', 'privacy-policy', 'faq', 'community']
files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    for t in targets:
        content = content.replace(f'href="{t}"', f'href="/{t}"')
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Links updated successfully.")
