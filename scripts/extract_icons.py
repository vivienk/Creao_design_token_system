"""Extract literal Lucide geometry from the inspected bundle without executing it."""
import hashlib, html, json, pathlib, re, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
bundle=pathlib.Path(sys.argv[1]).read_text()
records=[]
for m in re.finditer(r'(?:const |,)(\w+)=(\[\[.*?\]\]),(\w+)=He\("([^"]+)",\1\)',bundle):
    shapes=[]
    for tag,body in re.findall(r'\["(\w+)",\{(.*?)\}\]',m[2]):
        attrs={}
        for a in re.finditer(r'(\w+):("(?:[^"\\]|\\.)*"|-?[\d.]+)',body):
            key,value=a.groups()
            if key=='key': continue
            attrs[key]=json.loads(value)
        shapes.append({'tag':tag,'attributes':attrs})
    if not shapes: raise ValueError('Empty geometry: '+m[4])
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    for shape in shapes:
        svg+='<'+shape['tag']+' '+ ' '.join(k+'="'+html.escape(str(v),quote=True)+'"' for k,v in shape['attributes'].items())+'/>'
    svg+='</svg>\n'
    path=ROOT/'design/assets/icons'/ (m[4]+'.svg');path.write_text(svg)
    records.append({'name':m[4],'bundleSymbol':m[3],'sourceOffset':m.start(),'sourceLiteral':m[2],'svg':str(path.relative_to(ROOT)),'sha256':hashlib.sha256(svg.encode()).hexdigest()})
data={'sourceUrl':'https://agent.creao.ai/assets/index-CQ8jNy7k.js','bundleSha256':hashlib.sha256(pathlib.Path(sys.argv[1]).read_bytes()).hexdigest(),'library':'lucide-react','version':'0.563.0','license':'ISC (bundle attribution)','defaultSize':24,'defaultStrokeWidth':2,'icons':records,'logo':{'sourceUrl':'https://agent.creao.ai/creao_black_logo.svg','path':'design/assets/creao_black_logo.svg','sha256':hashlib.sha256((ROOT/'design/assets/creao_black_logo.svg').read_bytes()).hexdigest()}}
(ROOT/'design/assets/manifest.json').write_text(json.dumps(data,indent=2)+'\n')
print('Extracted',len(records),'icons and registered original logo')
