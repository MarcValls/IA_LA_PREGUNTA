from pathlib import Path
from bs4 import BeautifulSoup
import json,re

ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/'frontend'/'index.html'
text=HTML.read_text(encoding='utf-8')
soup=BeautifulSoup(text,'html.parser')
data=json.loads(soup.find(id='ialp-offline-sim-data').string)
assert len(data['steps'])==163
assert sum(bool(x.get('gate')) for x in data['steps'])==12
assert all('mobile_scene' in x for x in data['steps'])
assert soup.find(id='ialp-mobile-classroom')
host=soup.find(id='mf-scene-host')
assert host and 'learning-section' not in (host.get('class') or [])
css=soup.find(id='ialp-mobile-first-v18-css').get_text()
for needle in ['grid-template-columns:1fr!important','overflow-wrap:break-word','hyphens:none','min-height:44px']:
    assert needle in css, needle
assert (ROOT/'capacitor'/'web'/'index.html').read_text(encoding='utf-8')==text
print('MOBILE_FIRST_STATIC_QA PASS 163 steps 12 gates')
