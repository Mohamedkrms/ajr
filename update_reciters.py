import urllib.request, json, re, os
import ast

js_file = 'client/src/components/recitersdata.jsx'
with open(js_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Try to extract the existing list using regex to preserve image URLs
existing_images = {}
for line in js_content.split('\n'):
    slug_match = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", line)
    img_match = re.search(r"img:\s*['\"]([^'\"]+)['\"]", line)
    if slug_match and img_match:
        existing_images[slug_match.group(1)] = img_match.group(1)

# Fetch new
data = json.loads(urllib.request.urlopen('https://quranicaudio.com/api/qaris').read().decode('utf-8'))

# Fallback image
DEFAULT_IMG = 'https://i.pinimg.com/564x/0a/40/9e/0a409ef09a55700877c20d7195fe9126.jpg' # Generic elegant quran img from prev list

out_lines = ['const RECITERS_DATA = [']
for qari in data:
    qid = qari['id']
    name = qari.get('arabic_name') or qari.get('name')
    path = qari.get('relative_path', '').strip('/')
    
    parts = path.split('/')
    slug = parts[0] if len(parts) > 0 else path
    year = parts[1] if len(parts) > 1 else None
    
    img = existing_images.get(slug, DEFAULT_IMG)
    
    # Escape quotes
    name_clean = name.replace("'", "\\'") if name else ''
    
    if year:
        out_lines.append(f"    {{ id: {qid}, slug: '{slug}', year: '{year}', name: '{name_clean}', img: '{img}' }},")
    else:
        out_lines.append(f"    {{ id: {qid}, slug: '{slug}', name: '{name_clean}', img: '{img}' }},")

out_lines.append('];\nexport { RECITERS_DATA };\n')

with open(js_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))
