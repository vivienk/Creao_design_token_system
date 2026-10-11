"""Extract source declarations, retaining selectors, precedence, and raw expressions.

The snapshot is compiled CSS; its upstream authored source is not available.
Only unconditional :root/:host and .dark declarations form the app-theme export.
Other selectors remain in the inventory for scope review, never merged into it.
"""
import hashlib, json, pathlib, re, math

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'design/source/creao.css'

def declarations(css):
    result = []
    for match in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
        selector, body = match.group(1).strip(), match.group(2)
        for d in re.finditer(r'(--[\w-]+)\s*:\s*([^;{}]+)', body):
            result.append(dict(selector=selector, name=d.group(1), value=d.group(2).strip(), offset=match.start(2)+d.start()))
    return result

def rgba(value):
    if re.fullmatch(r'#[0-9a-fA-F]{3,8}', value):
        h=value[1:]
        if len(h) in (3,4): h=''.join(c*2 for c in h)
        if len(h)==6: h+='ff'
        if len(h)!=8: return None
        return dict(zip('rgba',[int(h[i:i+2],16)/255 for i in (0,2,4,6)]))
    m=re.fullmatch(r'oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)',value)
    if m:
        L,C,H=map(float,m.groups()); L/=100; H=math.radians(H)
        a,b=C*math.cos(H),C*math.sin(H)
        l=(L+.3963377774*a+.2158037573*b)**3
        m0=(L-.1055613458*a-.0638541728*b)**3
        s=(L-.0894841775*a-1.291485548*b)**3
        linear=[4.0767416621*l-3.3077115913*m0+.2309699292*s,-1.2684380046*l+2.6097574011*m0-.3413193965*s,-.0041960863*l-.7034186147*m0+1.707614701*s]
        def gamma(x): return max(0,min(1,12.92*x if x<=.0031308 else 1.055*x**(1/2.4)-.055))
        return dict(zip('rgba',[*map(gamma,linear),1]))
    return None

def build():
    raw=SOURCE.read_text(); inventory=declarations(raw)
    light={d['name']:d['value'] for d in inventory if d['selector'] in (':root,:host',':root') and not d['name'].startswith(('--react-pdf','--highlight','--input-focus','--input-unfocused','--input-disabled','--input-hover','--link-outline','--annotation'))}
    dark={**light,**{d['name']:d['value'] for d in inventory if d['selector']=='.dark'}}
    # Export only source theme categories; environmental offsets and vendor variables remain inventoried.
    light={k:v for k,v in light.items() if k.startswith(('--color-','--font-','--text-','--radius','--spacing','--container-','--leading-','--tracking-','--shadow-','--ease-','--default-transition')) or k=='--control-surface'}
    dark={k:dark[k] for k in light}
    def resolve(k,values,trail=()):
        if k in trail: raise ValueError('Alias cycle: '+k)
        v=values[k]; alias=re.fullmatch(r'var\((--[\w-]+)\)',v)
        if alias: return resolve(alias[1],values,(*trail,k))
        c=rgba(v)
        if c: return c
        mix=re.fullmatch(r'color-mix\(in srgb,\s*var\((--[\w-]+)\)\s*([\d.]+)%,\s*(?:var\((--[\w-]+)\)|(transparent))\)',v)
        if mix:
            a=resolve(mix[1],values,(*trail,k)); weight=float(mix[2])/100
            b=resolve(mix[3],values,(*trail,k)) if mix[3] else dict(r=0,g=0,b=0,a=0)
            alpha=a['a']*weight+b['a']*(1-weight)
            return {**{ch:(a[ch]*a['a']*weight+b[ch]*b['a']*(1-weight))/alpha if alpha else 0 for ch in 'rgb'},'a':alpha}
        n=re.fullmatch(r'([\d.]+)(rem|px)?',v)
        if n: return float(n[1])*(16 if n[2]=='rem' else 1)
        return v
    tokens=[]
    for k,v in light.items():
        vals={mode:resolve(k,values) for mode,values in [('Light',light),('Dark',dark)]}
        # Normalize platform-dependent math noise without changing the raw CSS.
        vals={mode:({channel:round(number,7) for channel,number in value.items()} if isinstance(value,dict) else value) for mode,value in vals.items()}
        typ='COLOR' if all(isinstance(x,dict) for x in vals.values()) else 'FLOAT' if all(isinstance(x,(int,float)) for x in vals.values()) else 'STRING'
        tokens.append(dict(cssName=k,figmaName=re.sub(r'-+','/',k[2:]),type=typ,raw={'Light':v,'Dark':dark[k]},values=vals,aliases={m:(re.fullmatch(r'var\((--[\w-]+)\)',x)[1] if re.fullmatch(r'var\((--[\w-]+)\)',x) else None) for m,x in [('Light',v),('Dark',dark[k])]}))
    dark_only={d['name']:d['value'] for d in inventory if d['selector']=='.dark' and d['name'] not in light and d['name'].startswith(('--color-','--shadow-','--control-'))}
    return {'sourceUrl':'https://agent.creao.ai/assets/index-C3VRtTd6.css','sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'rootPxAssumption':16,'tokens':tokens,'darkOnly':dark_only,'inventory':inventory}

if __name__=='__main__':
    data=build(); out=ROOT/'design/generated'; out.mkdir(exist_ok=True)
    (out/'token-map.json').write_text(json.dumps(data,indent=2)+'\n')
    css='/* Generated from pinned CREAO CSS. Do not edit. */\n'
    for mode,selector in [('Light',':root'),('Dark','.dark')]:
        css+=selector+' {\n'+''.join('  '+t['cssName']+': '+t['raw'][mode]+';\n' for t in data['tokens'])+(''.join('  '+k+': '+v+';\n' for k,v in data['darkOnly'].items()) if mode=='Dark' else '')+'}\n'
    (out/'tokens.css').write_text(css)
    print('Extracted',len(data['tokens']),'theme tokens;',len(data['inventory']),'scoped declarations inventoried')
