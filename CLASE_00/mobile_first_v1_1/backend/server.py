from __future__ import annotations

import argparse
import json
import os
import sqlite3
import threading
import time
import urllib.error
import urllib.request
import webbrowser
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

APP_NAME = "IA. LA PREGUNTA — Clase 00 interactiva"
MAX_BODY = 512 * 1024
COURSE_SYSTEM = (
    "Eres el profesor principal del curso ‘IA. LA PREGUNTA’. Estás enseñando la Clase 00: "
    "‘Antes de aprender a responder’. No eres un chatbot auxiliar: diriges la clase. Narras y explicas "
    "cada bloque que el alumno ve a la derecha, decides cuándo proponer un ejercicio, haces una pregunta "
    "cada vez, esperas el intento del alumno, lo revisas y solo entonces indicas el siguiente paso. "
    "La doctrina central es comprender antes de responder; distinguir expresión, interpretación, acción "
    "requerida, resultado esperado, contexto, evidencia, suposición e incertidumbre. Trabaja de forma "
    "socrática. No hagas los ejercicios por el alumno ni reveles la solución antes de su intento. No "
    "inventes información ausente y separa claramente hechos de inferencias. Haz referencia al contenido "
    "visible cuando sea útil: ‘mira aquí’, ‘fíjate en este esquema’, etc. Cuando señales contenido, céntrate "
    "en el FRAGMENTO EN FOCO que recibe la interfaz; no describas como activo otro fragmento distinto. Responde en "
    "español claro, pedagógico y directo. Usa párrafos breves, **negrita** para una idea clave y listas con guion solo "
    "cuando aporten claridad. No uses tablas ni encabezados Markdown."
)


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


class Database:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self.init()

    def connect(self):
        conn = sqlite3.connect(self.path, timeout=10)
        conn.row_factory = sqlite3.Row
        return conn

    def init(self):
        with self._lock, self.connect() as con:
            con.executescript(
                """
                PRAGMA journal_mode=WAL;
                CREATE TABLE IF NOT EXISTS app_state (
                    key TEXT PRIMARY KEY,
                    value_json TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS teacher_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    role TEXT NOT NULL CHECK(role IN ('user','assistant')),
                    content TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS meta (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                );
                INSERT OR IGNORE INTO meta(key,value) VALUES('schema_version','1');
                """
            )

    def get_state(self) -> dict[str, Any] | None:
        with self.connect() as con:
            row = con.execute("SELECT value_json FROM app_state WHERE key='class00'").fetchone()
            if not row:
                return None
            try:
                return json.loads(row[0])
            except json.JSONDecodeError:
                return None

    def set_state(self, state: dict[str, Any]) -> None:
        raw = json.dumps(state, ensure_ascii=False, separators=(",", ":"))
        now = utcnow()
        with self._lock, self.connect() as con:
            con.execute(
                """INSERT INTO app_state(key,value_json,updated_at) VALUES('class00',?,?)
                   ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json, updated_at=excluded.updated_at""",
                (raw, now),
            )

    def add_message(self, role: str, content: str) -> None:
        if role not in ("user", "assistant"):
            raise ValueError("invalid role")
        with self._lock, self.connect() as con:
            con.execute(
                "INSERT INTO teacher_messages(role,content,created_at) VALUES(?,?,?)",
                (role, content, utcnow()),
            )

    def history(self, limit: int = 20) -> list[dict[str, str]]:
        limit = max(1, min(int(limit), 50))
        with self.connect() as con:
            rows = con.execute(
                "SELECT role,content,created_at FROM teacher_messages ORDER BY id DESC LIMIT ?", (limit,)
            ).fetchall()
        return [dict(r) for r in reversed(rows)]

    def clear_history(self) -> None:
        with self._lock, self.connect() as con:
            con.execute("DELETE FROM teacher_messages")


class OllamaClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    def _request(self, path: str, *, method: str = "GET", payload: dict[str, Any] | None = None, timeout: int = 120):
        body = None
        headers = {"Accept": "application/json"}
        if payload is not None:
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(self.base_url + path, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                raw = resp.read()
                return json.loads(raw.decode("utf-8")) if raw else {}
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")[:1000]
            raise RuntimeError(f"Ollama HTTP {exc.code}: {detail or exc.reason}") from exc
        except urllib.error.URLError as exc:
            raise RuntimeError(f"No se puede conectar con Ollama en {self.base_url}: {exc.reason}") from exc

    def models(self) -> dict[str, Any]:
        return self._request("/api/tags", timeout=8)

    def chat(self, payload: dict[str, Any]) -> dict[str, Any]:
        payload = dict(payload)
        payload["stream"] = False
        return self._request("/api/chat", method="POST", payload=payload, timeout=180)


class AppHandler(SimpleHTTPRequestHandler):
    server_version = "IALPInteractive/1.5"
    frontend_dir = Path(".")

    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=str(type(self).frontend_dir), **kwargs)

    def log_message(self, fmt, *args):
        print(f"{self.address_string()} - - [{self.log_date_time_string()}] {fmt % args}")

    def _json(self, data: Any, status: int = 200):
        raw = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(raw)

    def _read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0:
            return {}
        if length > MAX_BODY:
            raise ValueError("Cuerpo demasiado grande")
        raw = self.rfile.read(length)
        try:
            data = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            raise ValueError("JSON no válido") from exc
        if not isinstance(data, dict):
            raise ValueError("Se esperaba un objeto JSON")
        return data

    def _ollama_error(self, exc: Exception):
        self._json({"error": str(exc)}, status=HTTPStatus.SERVICE_UNAVAILABLE)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/favicon.ico":
            self.send_response(HTTPStatus.NO_CONTENT)
            self.end_headers()
            return
        if path == "/api/health":
            ollama_ok = False
            models = []
            error = None
            try:
                data = self.server.ollama.models()
                models = [m.get("name") for m in data.get("models", []) if m.get("name")]
                ollama_ok = True
            except Exception as exc:
                error = str(exc)
            self._json({
                "app": APP_NAME,
                "ok": True,
                "database": str(self.server.db.path.name),
                "ollama": {"ok": ollama_ok, "endpoint": self.server.ollama.base_url, "models": models, "error": error},
            })
            return
        if path == "/api/state":
            self._json({"state": self.server.db.get_state()})
            return
        if path == "/api/ollama/models":
            try:
                self._json(self.server.ollama.models())
            except Exception as exc:
                self._ollama_error(exc)
            return
        if path == "/api/teacher/history":
            self._json({"messages": self.server.db.history()})
            return
        if path.startswith("/api/"):
            self._json({"error": "Ruta API no encontrada"}, status=HTTPStatus.NOT_FOUND)
            return
        if path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_PUT(self):
        path = self.path.split("?", 1)[0]
        if path != "/api/state":
            self._json({"error": "Ruta API no encontrada"}, status=HTTPStatus.NOT_FOUND)
            return
        try:
            data = self._read_json()
            state = data.get("state")
            if not isinstance(state, dict):
                raise ValueError("Falta state")
            self.server.db.set_state(state)
            self._json({"ok": True, "updatedAt": utcnow()})
        except ValueError as exc:
            self._json({"error": str(exc)}, status=HTTPStatus.BAD_REQUEST)

    def do_DELETE(self):
        path = self.path.split("?", 1)[0]
        if path == "/api/teacher/history":
            self.server.db.clear_history()
            self._json({"ok": True})
            return
        self._json({"error": "Ruta API no encontrada"}, status=HTTPStatus.NOT_FOUND)

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        try:
            data = self._read_json()
        except ValueError as exc:
            self._json({"error": str(exc)}, status=HTTPStatus.BAD_REQUEST)
            return

        if path == "/api/ollama/chat":
            try:
                model = str(data.get("model", "")).strip()
                messages = data.get("messages")
                if not model or not isinstance(messages, list) or not messages:
                    raise ValueError("model y messages son obligatorios")
                allowed = {"model", "messages", "stream", "options", "format", "keep_alive", "think"}
                payload = {k: v for k, v in data.items() if k in allowed}
                payload["stream"] = False
                self._json(self.server.ollama.chat(payload))
            except ValueError as exc:
                self._json({"error": str(exc)}, status=HTTPStatus.BAD_REQUEST)
            except Exception as exc:
                self._ollama_error(exc)
            return

        if path == "/api/teacher/welcome":
            try:
                model = str(data.get("model", "")).strip()
                if not model:
                    raise ValueError("Selecciona un modelo")
                temperature = max(0.0, min(1.0, float(data.get("temperature", 0.2))))
                title = str(data.get("title", "Clase 00")).strip()[:500]
                context = str(data.get("context", "")).strip()[:9000]
                exercise = str(data.get("exercise", "")).strip()[:5000]
                focus_id = str(data.get("focus_id", "")).strip()[:300]
                focus_label = str(data.get("focus_label", "")).strip()[:500]
                focus_text = str(data.get("focus_text", "")).strip()[:5000]
                prompt = (
                    "Preséntate como el profesor de esta clase en 1–2 frases y empieza a enseñar inmediatamente. "
                    "No preguntes si el alumno quiere empezar. Narra y explica el bloque actual que está viendo a la derecha, "
                    "destaca una sola idea central y, si el bloque contiene un ejercicio, formula la consigna sin resolverla. "
                    "Incluye la expresión **Mira aquí** cuando quieras dirigir la atención al fragmento iluminado a la derecha. "
                    "Termina con una pregunta concreta o una acción que el alumno deba realizar ahora.\n\n"
                    f"BLOQUE ACTUAL: {title}\n"
                    f"FRAGMENTO EN FOCO: {focus_label or '(sin etiqueta)'} [{focus_id or 'sin-id'}]\n"
                    f"TEXTO DEL FRAGMENTO: {focus_text or context or '(sin contexto adicional)'}\n"
                    f"EJERCICIO DEL BLOQUE: {exercise or '(no hay ejercicio explícito en este bloque)'}"
                )
                result = self.server.ollama.chat({
                    "model": model,
                    "messages": [{"role": "system", "content": COURSE_SYSTEM}, {"role": "user", "content": prompt}],
                    "options": {"temperature": temperature},
                    "stream": False,
                })
                content = (result.get("message") or {}).get("content") or "Empezamos. Mira el bloque de la derecha."
                self.server.db.add_message("assistant", content)
                self._json({"content": content, "history": self.server.db.history(), "focus_id": focus_id})
            except ValueError as exc:
                self._json({"error": str(exc)}, status=HTTPStatus.BAD_REQUEST)
            except Exception as exc:
                self._ollama_error(exc)
            return

        if path == "/api/teacher/guide":
            try:
                model = str(data.get("model", "")).strip()
                if not model:
                    raise ValueError("Selecciona un modelo")
                action = str(data.get("action", "start")).strip().lower()[:40]
                title = str(data.get("title", "Clase 00")).strip()[:500]
                context = str(data.get("context", "")).strip()[:9000]
                exercise = str(data.get("exercise", "")).strip()[:5000]
                answers = str(data.get("answers", "")).strip()[:6000]
                focus_id = str(data.get("focus_id", "")).strip()[:300]
                focus_label = str(data.get("focus_label", "")).strip()[:500]
                focus_text = str(data.get("focus_text", "")).strip()[:5000]
                temperature = max(0.0, min(1.0, float(data.get("temperature", 0.2))))
                instructions = {
                    "start": "Introduce y explica este bloque. Señala qué debe mirar el alumno y termina con una sola pregunta o tarea.",
                    "next": "El alumno acaba de avanzar a este bloque. Conecta brevemente con el anterior, explica la idea nueva y marca el siguiente paso.",
                    "repeat": "Explica de nuevo el bloque con otra formulación y un ejemplo distinto. No añadas doctrina que no aparezca en el contenido.",
                    "exercise": "Actúa como profesor durante el ejercicio. Explica la consigna, haz una pregunta cada vez y pide al alumno que responda en los campos de la derecha. No des la solución.",
                    "hint": "Da una sola pista útil sobre el ejercicio. No resuelvas la tarea y termina indicando qué debería observar el alumno.",
                    "review": "Revisa el intento del alumno. Usa exactamente estas partes: ACIERTOS, QUÉ FALTA, SUPOSICIONES NO JUSTIFICADAS, SIGUIENTE PASO. Si es suficiente, dilo y autoriza continuar; si no, pide una corrección concreta.",
                    "closing": "Cierra la clase con una síntesis breve de lo aprendido y una pregunta de transferencia. No abras contenido nuevo.",
                }
                instruction = instructions.get(action, instructions["start"])
                prompt = (
                    f"ACCIÓN DEL PROFESOR: {action}\n{instruction}\n\n"
                    f"BLOQUE ACTUAL: {title}\n"
                    f"FRAGMENTO EN FOCO: {focus_label or '(sin etiqueta)'} [{focus_id or 'sin-id'}]\n"
                    f"TEXTO DEL FRAGMENTO: {focus_text or context or '(sin contexto adicional)'}\n"
                    "Cuando dirijas la atención al documento, usa la frase **Mira aquí**. La interfaz dibujará la flecha al fragmento en foco.\n"
                    f"EJERCICIO: {exercise or '(sin ejercicio explícito)'}\n"
                    f"RESPUESTA/ESTADO DEL ALUMNO: {answers or '(todavía sin respuesta)'}"
                )
                history = self.server.db.history(limit=14)
                messages = [{"role": "system", "content": COURSE_SYSTEM}]
                messages += [{"role": h["role"], "content": h["content"]} for h in history]
                messages.append({"role": "user", "content": prompt})
                result = self.server.ollama.chat({"model": model, "messages": messages, "stream": False, "options": {"temperature": temperature}})
                content = (result.get("message") or {}).get("content") or "Continuamos."
                if action in ("review", "hint") and answers:
                    self.server.db.add_message("user", f"[{title}] {answers}")
                self.server.db.add_message("assistant", content)
                self._json({"content": content, "action": action, "focus_id": focus_id})
            except ValueError as exc:
                self._json({"error": str(exc)}, status=HTTPStatus.BAD_REQUEST)
            except Exception as exc:
                self._ollama_error(exc)
            return

        if path == "/api/teacher/chat":
            try:
                model = str(data.get("model", "")).strip()
                message = str(data.get("message", "")).strip()
                lesson = str(data.get("lesson", "Clase 00")).strip()[:500]
                context = str(data.get("context", "")).strip()[:9000]
                exercise = str(data.get("exercise", "")).strip()[:5000]
                answers = str(data.get("answers", "")).strip()[:6000]
                focus_id = str(data.get("focus_id", "")).strip()[:300]
                focus_label = str(data.get("focus_label", "")).strip()[:500]
                focus_text = str(data.get("focus_text", "")).strip()[:5000]
                if not model or not message:
                    raise ValueError("model y message son obligatorios")
                temperature = max(0.0, min(1.0, float(data.get("temperature", 0.2))))
                history = self.server.db.history(limit=14)
                system = COURSE_SYSTEM + (
                    f"\nBloque actual del alumno: {lesson}."
                    f"\nFragmento en foco a la derecha: {focus_label or '(sin etiqueta)'} [{focus_id or 'sin-id'}]."
                    f"\nTexto exacto del fragmento en foco: {focus_text or context or '(no enviado)'}."
                    "\nSi necesitas dirigir la atención del alumno a ese fragmento, escribe **Mira aquí**; la interfaz lo iluminará y dibujará una flecha."
                    f"\nEjercicio activo: {exercise or '(ninguno)'}."
                    f"\nEstado actual de respuestas: {answers or '(sin respuesta registrada)'}."
                )
                messages = [{"role": "system", "content": system}]
                messages += [{"role": h["role"], "content": h["content"]} for h in history]
                messages.append({"role": "user", "content": message})
                result = self.server.ollama.chat({"model": model, "messages": messages, "stream": False, "options": {"temperature": temperature}})
                content = (result.get("message") or {}).get("content") or "No he recibido contenido del modelo."
                self.server.db.add_message("user", message)
                self.server.db.add_message("assistant", content)
                self._json({"content": content, "focus_id": focus_id})
            except ValueError as exc:
                self._json({"error": str(exc)}, status=HTTPStatus.BAD_REQUEST)
            except Exception as exc:
                self._ollama_error(exc)
            return

        self._json({"error": "Ruta API no encontrada"}, status=HTTPStatus.NOT_FOUND)


class AppServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def __init__(self, addr, handler, *, frontend_dir: Path, db: Database, ollama: OllamaClient):
        self.frontend_dir = frontend_dir
        handler.frontend_dir = frontend_dir
        self.db = db
        self.ollama = ollama
        super().__init__(addr, handler)


def main():
    parser = argparse.ArgumentParser(description=APP_NAME)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--ollama", default=os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434"))
    parser.add_argument("--db", default=None, help="Ruta opcional a la base SQLite")
    parser.add_argument("--open", action="store_true", dest="open_browser")
    args = parser.parse_args()

    here = Path(__file__).resolve().parent
    root = here.parent
    frontend = root / "frontend"
    db_path = Path(args.db).expanduser().resolve() if args.db else (root / "data" / "ialp_clase00.sqlite3")
    db = Database(db_path)
    server = AppServer((args.host, args.port), AppHandler, frontend_dir=frontend, db=db, ollama=OllamaClient(args.ollama))
    url = f"http://{args.host}:{args.port}/"

    print(APP_NAME)
    print(f"Aplicación: {url}")
    print(f"SQLite: {db.path}")
    print(f"Ollama: {server.ollama.base_url}")
    print("Cierra esta ventana o pulsa Ctrl+C para detener el servidor.")

    if args.open_browser:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever(poll_interval=0.3)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        print("Servidor detenido.")


if __name__ == "__main__":
    main()
