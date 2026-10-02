#!/usr/bin/env python3
"""Generate photoreal reference images for docs/locs: one per style per vantage
point (front, side, back, top).

Prompts come from docs/locs/catalog.js (promptFor), so the page, this script
and the Prompts tab always agree. Images land in docs/locs/img/<id>-<view>.<ext>
and docs/locs/img/manifest.json tells the page which files exist:
  {"wicks": {"views": {"front": {"file": "img/wicks-front.jpg", ...}, "back": {...}}}}

Providers (pick with --provider, or leave on auto to use the first key found):
  openai     OPENAI_API_KEY        model gpt-image-1
  gemini     GEMINI_API_KEY        model gemini-2.5-flash-image
  replicate  REPLICATE_API_TOKEN   model black-forest-labs/flux-1.1-pro
  stability  STABILITY_API_KEY     model sd3.5-large

Examples:
  python3 tools/gen_images.py                       # all styles, all 4 angles, skip existing
  python3 tools/gen_images.py --views front,back    # some angles only
  python3 tools/gen_images.py --only wicks,classic  # a few styles
  python3 tools/gen_images.py --force --provider gemini
  python3 tools/gen_images.py --dry-run             # print prompts only

Only the Python standard library is used. Rough cost at the time of writing:
3 to 8 US cents per image on every provider, so the full 152-image run is
roughly 5 to 12 dollars.
"""
import argparse, base64, json, mimetypes, os, subprocess, sys, time, urllib.request, urllib.error, uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCS = os.path.join(ROOT, 'docs', 'locs')
IMG = os.path.join(LOCS, 'img')
MANIFEST = os.path.join(IMG, 'manifest.json')

def load_prompts(views):
    js = ("const c=require(process.argv[1]);const views=process.argv[2].split(',');"
          "console.log(JSON.stringify(c.STYLES.flatMap(s=>views.map(v=>({id:s.id,name:s.name,...c.promptFor(s,v)})))))")
    out = subprocess.run(['node', '-e', js, os.path.join(LOCS, 'catalog.js'), ','.join(views)], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)

def http(url, data=None, headers=None, method=None, timeout=300):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read(), r.headers.get('Content-Type', '')
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', 'replace')[:800]
        raise SystemExit(f'HTTP {e.code} from {url}\n{body}')

def gen_openai(p, key):
    body = json.dumps({'model': 'gpt-image-1', 'prompt': p['positive'], 'size': ('1024x1024' if p['view']=='top' else '1024x1536'), 'quality': 'medium', 'n': 1}).encode()
    raw, _ = http('https://api.openai.com/v1/images/generations', body, {'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'})
    j = json.loads(raw)
    return base64.b64decode(j['data'][0]['b64_json']), 'image/png', 'gpt-image-1'

def gen_gemini(p, key):
    body = json.dumps({'contents': [{'parts': [{'text': p['positive'] + ' Avoid: ' + p['negative'] + '. Portrait orientation, 2:3.'}]}],
                       'generationConfig': {'responseModalities': ['IMAGE']}}).encode()
    raw, _ = http('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent', body,
                  {'x-goog-api-key': key, 'Content-Type': 'application/json'})
    j = json.loads(raw)
    for part in j['candidates'][0]['content']['parts']:
        if 'inlineData' in part:
            return base64.b64decode(part['inlineData']['data']), part['inlineData'].get('mimeType', 'image/png'), 'gemini-2.5-flash-image'
    raise SystemExit('Gemini returned no image: ' + json.dumps(j)[:500])

def gen_replicate(p, key):
    body = json.dumps({'input': {'prompt': p['positive'], 'aspect_ratio': ('1:1' if p['view']=='top' else '2:3'), 'output_format': 'jpg', 'safety_tolerance': 2, 'prompt_upsampling': False}}).encode()
    raw, _ = http('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', body,
                  {'Authorization': f'Bearer {key}', 'Content-Type': 'application/json', 'Prefer': 'wait=60'})
    j = json.loads(raw)
    while j.get('status') not in ('succeeded', 'failed', 'canceled'):
        time.sleep(2)
        raw, _ = http(j['urls']['get'], headers={'Authorization': f'Bearer {key}'})
        j = json.loads(raw)
    if j['status'] != 'succeeded':
        raise SystemExit('Replicate failed: ' + json.dumps(j.get('error'))[:500])
    url = j['output'] if isinstance(j['output'], str) else j['output'][0]
    img, ctype = http(url)
    return img, ctype or 'image/jpeg', 'flux-1.1-pro'

def gen_stability(p, key):
    boundary = uuid.uuid4().hex
    fields = {'prompt': p['positive'], 'negative_prompt': p['negative'], 'aspect_ratio': ('1:1' if p['view']=='top' else '2:3'), 'output_format': 'jpeg', 'model': 'sd3.5-large'}
    parts = []
    for k, v in fields.items():
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    parts.append(f'--{boundary}--\r\n'.encode())
    raw, _ = http('https://api.stability.ai/v2beta/stable-image/generate/sd3', b''.join(parts),
                  {'Authorization': f'Bearer {key}', 'Accept': 'image/*', 'Content-Type': f'multipart/form-data; boundary={boundary}'})
    return raw, 'image/jpeg', 'sd3.5-large'

PROVIDERS = [('openai', 'OPENAI_API_KEY', gen_openai), ('gemini', 'GEMINI_API_KEY', gen_gemini),
             ('replicate', 'REPLICATE_API_TOKEN', gen_replicate), ('stability', 'STABILITY_API_KEY', gen_stability)]

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--provider', default='auto', choices=['auto'] + [p[0] for p in PROVIDERS])
    ap.add_argument('--only', default='', help='comma-separated style ids')
    ap.add_argument('--views', default='front,side,back,top', help='comma-separated angles')
    ap.add_argument('--force', action='store_true', help='regenerate even if an image exists')
    ap.add_argument('--dry-run', action='store_true', help='print prompts, call nothing')
    ap.add_argument('--sleep', type=float, default=1.0, help='seconds between calls')
    a = ap.parse_args()

    views = [v.strip() for v in a.views.split(',') if v.strip() in ('front', 'side', 'back', 'top')]
    if not views:
        raise SystemExit('--views must name front, side, back or top')
    prompts = load_prompts(views)
    if a.only:
        want = set(a.only.split(','))
        prompts = [p for p in prompts if p['id'] in want]
    os.makedirs(IMG, exist_ok=True)
    manifest = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}

    if a.dry_run:
        for p in prompts:
            print(f"== {p['id']} · {p['name']} · {p['view']}\n{p['positive']}\n-- negative: {p['negative']}\n")
        return

    chosen = None
    for name, env, fn in PROVIDERS:
        if (a.provider in ('auto', name)) and os.environ.get(env):
            chosen = (name, os.environ[env], fn); break
    if not chosen:
        names = ', '.join(f'{n} ({e})' for n, e, _ in PROVIDERS)
        raise SystemExit(f'No image provider key found. Set one of: {names}')
    name, key, fn = chosen
    print(f'provider: {name}')

    def entry(pid, view):
        m = manifest.get(pid) or {}
        if 'views' in m:
            return m['views'].get(view)
        if view == 'front' and 'file' in m:   # manifest written before angles existed
            return m
        return None

    for i, p in enumerate(prompts, 1):
        tag = f"{p['id']} ({p['view']})"
        e = entry(p['id'], p['view'])
        if not a.force and e and os.path.exists(os.path.join(LOCS, e['file'])):
            print(f"[{i}/{len(prompts)}] {tag}: exists, skipping"); continue
        print(f"[{i}/{len(prompts)}] {tag}: generating…", flush=True)
        img, ctype, model = fn(p, key)
        ext = {'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp'}.get(ctype.split(';')[0].strip(), 'jpg')
        fname = f"{p['id']}-{p['view']}.{ext}"
        with open(os.path.join(IMG, fname), 'wb') as f:
            f.write(img)
        m = manifest.setdefault(p['id'], {})
        if 'file' in m and 'views' not in m:
            m['views'] = {'front': {k: m.pop(k) for k in ('file', 'provider', 'model', 'created') if k in m}}
        m.setdefault('views', {})[p['view']] = {'file': f'img/{fname}', 'provider': name, 'model': model, 'created': time.strftime('%Y-%m-%d')}
        json.dump(manifest, open(MANIFEST, 'w'), indent=1, sort_keys=True)
        time.sleep(a.sleep)
    total = sum(len(m.get('views', {})) + (1 if 'file' in m else 0) for m in manifest.values())
    print(f'done. {total} images listed in {os.path.relpath(MANIFEST, ROOT)}')

if __name__ == '__main__':
    main()
