from pathlib import Path
import re, subprocess, sys, os, json

ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/'frontend'/'index.html'
text=HTML.read_text(encoding='utf-8')

# Tour markup present
assert '<div id="ialp-tour" hidden>' in text, 'tour container missing'
assert '<style id="ialp-tour-css">' in text, 'tour CSS missing'
assert '<script id="ialp-tour-runtime">' in text, 'tour runtime missing'

# Runtime syntax check
start=text.find('<script id="ialp-tour-runtime">')
end=text.find('</script>', start)
assert start!=-1 and end!=-1, 'tour runtime markers not found'
script=text[start+len('<script id="ialp-tour-runtime">'):end]
tmp=Path(os.environ['TEMP'])/'ialp_tour_runtime_check.js'
tmp.write_text(script, encoding='utf-8')
res=subprocess.run(['node','--check',str(tmp)], capture_output=True, text=True)
assert res.returncode==0, f'tour runtime syntax error: {res.stderr}'

# Key tour strings present
for needle in ['Bienvenido','El Maestro','Mira aquí','Revisa la escena','Avanza','ialp-tour-reset']:
    assert needle in text, f'tour missing string: {needle}'

# Steps reference the actual UI controls in the document
assert 'data-mf-action="continue"' in text
assert '#mf-seen' in text
assert '#teacher-next' in text
assert '.offline-sim-tools button:first-of-type' in text

print('TOUR_QA PASS: tour markup, CSS, runtime syntax and key steps present')
