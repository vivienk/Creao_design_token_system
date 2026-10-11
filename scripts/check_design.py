"""Fail CI on source/export drift and simple first-party style bypasses."""
import json, pathlib, re, sys
from extract_tokens import build, ROOT

errors=[]
actual=build()
saved=json.loads((ROOT/'design/generated/token-map.json').read_text())
if actual!=saved: errors.append('Token mapping is stale; regenerate from the pinned source.')
css='/* Generated from pinned CREAO CSS. Do not edit. */\n'
for mode,selector in [('Light',':root'),('Dark','.dark')]:
    css+=selector+' {\n'+''.join('  '+t['cssName']+': '+t['raw'][mode]+';\n' for t in actual['tokens'])+(''.join('  '+k+': '+v+';\n' for k,v in actual['darkOnly'].items()) if mode=='Dark' else '')+'}\n'
if css!=(ROOT/'design/generated/tokens.css').read_text(): errors.append('Generated CSS differs from source declarations.')
known={t['cssName'] for t in actual['tokens']}|set(actual['darkOnly'])
for t in actual['tokens']:
    for mode,alias in t['aliases'].items():
        if alias and alias not in known: errors.append(f'Missing alias target {t["cssName"]} {mode}: {alias}')
    if t['figmaName'].count('//'): errors.append('Figma name has empty path: '+t['cssName'])
names=[t['figmaName'] for t in actual['tokens']]
if len(names)!=len(set(names)): errors.append('Figma variable name collision')
for folder in ('src','app','components'):
    root=ROOT/folder
    if not root.exists(): continue
    for p in root.rglob('*'):
        if p.suffix not in ('.css','.scss','.tsx','.jsx','.ts','.js'): continue
        content=p.read_text()
        if re.search(r'#[0-9a-fA-F]{3,8}\b|(?:rgb|hsl|oklch)a?\s*\(',content): errors.append(str(p.relative_to(ROOT))+': raw color; use existing semantic CSS tokens')
        for name in re.findall(r'var\((--[\w-]+)',content):
            if name not in known: errors.append(str(p.relative_to(ROOT))+': unknown token '+name)
        if re.search(r'--(?:color|font|radius|spacing|text)-?[\w-]*\s*:',content): errors.append(str(p.relative_to(ROOT))+': token redefinition outside source adapter')
        if re.search(r'(?:bg|text|border|fill|stroke)-\[',content): errors.append(str(p.relative_to(ROOT))+': arbitrary Tailwind color/type utility requires review')
        if p.suffix in ('.css','.scss') and re.search(r'(?:padding|margin|gap)\s*:[^;{}]*\b\d+(?:px|rem)',content): errors.append(str(p.relative_to(ROOT))+': spacing literal; use calc(var(--spacing) * n)')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(f'PASS: {len(actual["tokens"])} mapped tokens, {len(actual["darkOnly"])} dark-only declarations; source, aliases, names and CSS match.')
print('Application checks are limited to existing src/app/components files; no runtime or accessibility certification.')
