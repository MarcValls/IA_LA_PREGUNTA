"""Smoke test sin Ollama real: levanta un Ollama simulado y el backend v1.6."""
from __future__ import annotations
import json, subprocess, sys, threading, time, urllib.request, tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

class MockOllama(BaseHTTPRequestHandler):
    def log_message(self,*a): pass
    def do_GET(self):
        if self.path == '/api/tags':
            raw=json.dumps({'models':[{'name':'mock-teacher:latest'}]}).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw);return
        self.send_error(404)
    def do_POST(self):
        if self.path == '/api/chat':
            n=int(self.headers.get('Content-Length','0')); payload=json.loads(self.rfile.read(n) or b'{}')
            txt='**Mira aquí**. Observa este fragmento.\n- Identifica qué sabes.\n- Distingue qué falta antes de responder.'
            raw=json.dumps({'model':payload.get('model'),'message':{'role':'assistant','content':txt},'done':True}).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw);return
        self.send_error(404)

def get(url):
    with urllib.request.urlopen(url,timeout=5) as r: return r.status, json.loads(r.read().decode())
def req(url,method,payload):
    data=json.dumps(payload).encode(); q=urllib.request.Request(url,data=data,method=method,headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(q,timeout=8) as r: return r.status, json.loads(r.read().decode())

def main():
    mock=ThreadingHTTPServer(('127.0.0.1',11435),MockOllama); threading.Thread(target=mock.serve_forever,daemon=True).start()
    tmp=tempfile.TemporaryDirectory(); dbpath=str(Path(tmp.name)/'qa.sqlite3')
    proc=subprocess.Popen([sys.executable,str(ROOT/'backend'/'server.py'),'--host','127.0.0.1','--port','8766','--ollama','http://127.0.0.1:11435','--db',dbpath],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        for _ in range(30):
            try:
                status,data=get('http://127.0.0.1:8766/api/health'); break
            except Exception: time.sleep(.1)
        else: raise RuntimeError('backend no arrancó')
        assert status==200 and data['ok'] and data['ollama']['ok']
        ctx={'model':'mock-teacher:latest','temperature':0.2,'title':'Lección 1','context':'Comprender antes de responder.','exercise':'Explica qué falta.','focus_id':'unidad-1-f03','focus_label':'Una frase · ocho operaciones posibles','focus_text':'¿Lo lees? ¿Buscas un error?'}
        w=req('http://127.0.0.1:8766/api/teacher/welcome','POST',ctx)[1]
        assert w['focus_id']=='unidad-1-f03' and 'Mira aquí' in w['content']
        g=req('http://127.0.0.1:8766/api/teacher/guide','POST',{**ctx,'action':'next','answers':'Campo 1: prueba'})[1]
        assert g['action']=='next' and g['focus_id']=='unidad-1-f03'
        c=req('http://127.0.0.1:8766/api/teacher/chat','POST',{**ctx,'message':'¿Qué debo mirar?','lesson':'Lección 1','answers':'criterio'})[1]
        assert c['focus_id']=='unidad-1-f03' and c['content']
        state={'answers':{'x':'y'},'checks':{},'selects':{},'visited':{},'currentFocus':'unidad-1-f03','updatedAt':'2026-09-27T00:00:00Z'}
        assert req('http://127.0.0.1:8766/api/state','PUT',{'state':state})[0]==200
        assert get('http://127.0.0.1:8766/api/state')[1]['state']['currentFocus']=='unidad-1-f03'
        with urllib.request.urlopen('http://127.0.0.1:8766/favicon.ico',timeout=5) as r: assert r.status==204
        print('PASS backend/fullstack smoke: focus echo/welcome/guide/chat/sqlite')
    finally:
        proc.terminate(); proc.wait(timeout=5); mock.shutdown(); mock.server_close(); tmp.cleanup()

if __name__=='__main__': main()
