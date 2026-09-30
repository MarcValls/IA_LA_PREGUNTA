from html.parser import HTMLParser
from pathlib import Path
from collections import Counter
import re

root=Path(__file__).resolve().parents[1]
p=root/'frontend'/'index.html'
s=p.read_text(encoding='utf-8')

required=[
    '[hidden]{display:none!important}',
    'id="teacher-panel"', 'id="teacher-current"', 'id="teacher-focus-label"',
    'id="teacher-focus-arrow"', 'id="teacher-focus-path"',
    'id="teacher-tools"', '<summary>Lección <span>controles</span></summary>',
    'id="btn-settings"', 'Configuración', 'Conectar Ollama',
    'teacher-focusable', 'teacher-focus-target', 'teacher-focus-mode', 'teacher-focus-link', 'teacher-inline-focus',
    'function setCurrentFocus', 'function updateArrow', 'function advanceTeacher',
    'const focusSequence=[]', 'data.focus_id||ctx.focus_id',
    "fetch('/api/teacher/welcome'", "fetch('/api/teacher/chat'", "fetch('/api/teacher/guide'",
    'Pedir pista al maestro', 'Entregar al maestro',
    'renderTeacherText', 'teacher-message-tools',
    '--teacher-dock-width:50vw', 'id="teacher-font-size"', 'id="teacher-font-value"',
    'function applyTeacherFontSize', '--teacher-chat-font-size',
    'id="lesson-font-size"', 'id="lesson-font-value"', 'function applyLessonFontSize',
    '--lesson-text-font-size', '--lesson-input-font-size', 'lessonFontSize:16',
]
for x in required:
    assert x in s, x
assert "fetch(aiConfig.url+'/api/" not in s, 'queda llamada directa a Ollama desde navegador'
assert "fetch('/api/ollama/chat'" not in s, 'los ejercicios deben pasar por el Maestro'
assert 'id="btn-ai"' not in s, 'Ollama no debe ser un botón global; debe vivir dentro de Configuración'

# Toolbar must expose Configuración, not Ollama.
toolbar=re.search(r'<div class="toolbar-actions">(.*?)</div>',s,re.S)
assert toolbar, 'toolbar-actions missing'
assert 'Configuración' in toolbar.group(1)
assert '>Ollama<' not in toolbar.group(1)

class P(HTMLParser):
    def __init__(self): super().__init__(); self.ids=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'id' in d: self.ids.append(d['id'])
parser=P();parser.feed(s)
dups=[k for k,v in Counter(parser.ids).items() if v>1]
assert not dups, f'IDs duplicados: {dups}'
print('PASS frontend static: sync + 50/50 + persisted chat/lesson typography')
