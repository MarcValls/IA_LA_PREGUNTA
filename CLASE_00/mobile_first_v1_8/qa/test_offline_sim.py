from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parents[1]
html=(root/'frontend/index.html').read_text(encoding='utf-8')
sim=json.loads((root/'simulation/CLASE_00_OFFLINE_SCRIPT_v1.1.json').read_text(encoding='utf-8'))
assert sim['mode']=='deterministic_manual_advance'
assert sim['rules']['auto_advance'] is False
assert sim['rules']['required_steps_block_next'] is True
assert sim['step_count']==163, sim['step_count']
assert sim['steps'][0]['focus_id']=='unidad-0-f01'
assert sim['steps'][1]['focus_id']=='unidad-0-f02'
assert 'PREGUNTA DE ENTRADA' in sim['steps'][1]['focus_label']
assert sim['steps'][3]['focus_id']=='unidad-0-f04'
required=[s for s in sim['steps'] if s['required']]
assert len(required)==12, len(required)
assert all('gate' in s for s in required)
assert '<section class="learning-section intro-sequence"' in html
assert 'id="mobile-sim-switch"' not in html  # created dynamically
assert 'auto_advance' in html
assert "nextBtn.disabled=!canAdvance" in html
assert "const seen=isStepSeen(step)" in html
assert "function markStepSeen" in html
assert "function isStepSeen" in html
assert "if(!isStepSeen(step))" in html
assert "if(!gatePassed(step))" in html
assert "sim-future-locked" in html
assert "Guion pregenerado" in html
assert "OFFLINE · SIN IA" in html
assert "Ollama" in html  # legacy optional config code may remain but must not be required
assert (root/'capacitor/web/index.html').read_text(encoding='utf-8')==html
print('OFFLINE_SIM_QA PASS',sim['step_count'],'steps',len(required),'required gates')
