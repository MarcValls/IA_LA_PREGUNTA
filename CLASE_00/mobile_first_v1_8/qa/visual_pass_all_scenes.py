#!/usr/bin/env python3
"""
IALP Mobile-First · Final Visual Pass exhaustivo
Recorre TODOS los pasos del simulador offline (163) y captura:
  - Panel del Maestro
  - Panel de la Lección (escena semántica actual)
Incluye la portada/escena 0 y llega hasta el cierre/contraportada.
No captura escenas aleatorias: avanza paso a paso y guarda metadatos.

Uso:
  python qa/visual_pass_all_scenes.py
Salida:
  qa/visual_pass/          screenshots con índice de revisión
"""

from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
import subprocess, time, json, os, sys

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "frontend"
OUT = ROOT / "qa" / "visual_pass"
OUT.mkdir(parents=True, exist_ok=True)

# Buscar navegador Chromium/Edge en Windows
BROWSER_CANDIDATES = [
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
]


def find_browser():
    for p in BROWSER_CANDIDATES:
        if p.exists():
            return str(p)
    # Fallback: dejar que Playwright use el canal predeterminado
    return None


def start_server():
    port = 8899
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
        cwd=FRONTEND,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(1.0)
    return proc, f"http://127.0.0.1:{port}/index.html"


def wait_for_app(page, timeout=15000):
    page.wait_for_selector("#ialp-offline-sim-data", timeout=timeout)
    page.wait_for_function(
        "() => window.IALPOfflineControls && window.IALPMobileFirst",
        timeout=timeout,
    )
    page.wait_for_timeout(600)


def capture_element(page, selector, path):
    try:
        el = page.locator(selector).first
        if el.is_visible():
            el.screenshot(path=str(path))
            return True
    except PlaywrightTimeout:
        pass
    # fallback: screenshot de viewport
    page.screenshot(path=str(path))
    return True


def run():
    browser_path = find_browser()
    if browser_path:
        print(f"Navegador detectado: {browser_path}")
    else:
        print("Navegador no detectado en rutas habituales; Playwright usará el predeterminado.")

    server, url = start_server()
    try:
        with sync_playwright() as p:
            launch_kwargs = {
                "headless": True,
                "args": ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
            }
            if browser_path:
                launch_kwargs["executable_path"] = browser_path

            browser = p.chromium.launch(**launch_kwargs)
            context = browser.new_context(
                viewport={"width": 390, "height": 844},
                device_scale_factor=2,
                locale="es-ES",
            )
            page = context.new_page()

            page.on("pageerror", lambda e: print(f"  [JS ERROR] {e}"))
            page.on("console", lambda m: None)  # opcional: activar para debug

            page.goto(url, wait_until="domcontentloaded", timeout=20000)
            wait_for_app(page)

            # Estado fresco: reiniciar simulación
            page.evaluate(
                """
                () => {
                    const key = 'ialp.clase00.mobilefirst.sim.v1.1';
                    localStorage.removeItem(key);
                    localStorage.removeItem('ialp.mobilefirst.v18.pane');
                    const SIM = JSON.parse(document.getElementById('ialp-offline-sim-data').textContent);
                    window.__IALP_SIM = SIM;
                    window.__IALP_SIM_COUNT = SIM.steps.length;
                    return SIM.steps.length;
                }
                """
            )
            page.reload(wait_until="domcontentloaded", timeout=20000)
            wait_for_app(page)

            total = page.evaluate("() => window.__IALP_SIM_COUNT")
            print(f"Pasos detectados: {total}")

            manifest = []

            # --- PORTADA / ESCENA 0 ------------------------------------------------
            # En mobile el shell oculta la portada del PDF; capturamos el estado
            # inicial del shell como "escena 0" (antes de pulsar Siguiente).
            print("Capturando escena 0 / portada...")
            page.wait_for_timeout(500)
            cover_path = OUT / "scene_000_portada_teacher.png"
            capture_element(page, "#mf-teacher-pane", cover_path)

            # También capturamos la portada real en viewport desktop (si aplica)
            desktop_context = browser.new_context(
                viewport={"width": 1280, "height": 900},
                device_scale_factor=1,
                locale="es-ES",
            )
            desktop_page = desktop_context.new_page()
            desktop_page.goto(url, wait_until="domcontentloaded", timeout=20000)
            desktop_page.wait_for_timeout(800)
            desktop_page.screenshot(path=str(OUT / "cover_pdf_portada.png"), full_page=True)
            desktop_context.close()

            # --- RECORRIDO DE TODAS LAS ESCENAS ------------------------------------
            for i in range(total):
                step_num = i + 1
                # Ir directamente al paso (desbloqueamos todo desde JS)
                step_info = page.evaluate(
                    """
                    (index) => {
                        const ctl = window.IALPOfflineControls;
                        const SIM = window.__IALP_SIM || JSON.parse(document.getElementById('ialp-offline-sim-data').textContent);
                        const step = SIM.steps[index];
                        // Desbloquear y navegar
                        const key = 'ialp.clase00.mobilefirst.sim.v1.1';
                        let st = JSON.parse(localStorage.getItem(key) || '{}');
                        st.stepIndex = index;
                        st.maxUnlocked = Math.max(st.maxUnlocked || 0, index + 1);
                        if (step.gate) st.completed = st.completed || {};
                        if (step.gate && step.gate.mode !== 'auto_correct' && step.gate.mode !== 'auto_checklist') {
                            st.completed[step.index] = true;
                        }
                        localStorage.setItem(key, JSON.stringify(st));
                        ctl.goTo(index, {narrate: false, allowBackward: true});
                        return {
                            index: step.index,
                            focus_id: step.focus_id,
                            kind: step.kind,
                            section_title: step.section_title,
                            focus_label: step.focus_label,
                            required: step.required,
                            has_gate: !!step.gate,
                            gate_mode: step.gate ? step.gate.mode : null,
                        };
                    }
                    """,
                    i,
                )

                page.wait_for_timeout(400)
                # Asegurar que el panel del maestro esté activo
                page.evaluate(
                    """
                    () => {
                        if (window.IALPMobileFirst) window.IALPMobileFirst.setPane('teacher');
                        else document.body.classList.add('mobile-pane-teacher');
                    }
                    """
                )
                page.wait_for_timeout(200)

                teacher_file = OUT / f"scene_{step_num:03d}_teacher.png"
                lesson_file = OUT / f"scene_{step_num:03d}_lesson.png"

                capture_element(page, "#mf-teacher-pane", teacher_file)

                # Cambiar a Lección y capturar la escena semántica
                page.locator('button[data-mf-pane="lesson"]').click()
                page.wait_for_timeout(400)
                capture_element(page, "#mf-lesson-pane", lesson_file)

                manifest.append(
                    {
                        "step": step_num,
                        "focus_id": step_info["focus_id"],
                        "kind": step_info["kind"],
                        "section": step_info["section_title"],
                        "label": step_info["focus_label"],
                        "required": step_info["required"],
                        "has_gate": step_info["has_gate"],
                        "gate_mode": step_info["gate_mode"],
                        "teacher": str(teacher_file.relative_to(ROOT)).replace("\\", "/"),
                        "lesson": str(lesson_file.relative_to(ROOT)).replace("\\", "/"),
                    }
                )

                if step_num % 20 == 0 or step_num == total:
                    print(f"  Progreso: {step_num}/{total}")

            # --- CONTRAPORTADA / CIERRE -------------------------------------------
            # Capturar la última escena ya está incluida arriba. Además guardamos
            # un screenshot del estado final con el tab Lección en el cierre.
            page.locator('button[data-mf-pane="lesson"]').click()
            page.wait_for_timeout(300)
            capture_element(page, "#mf-lesson-pane", OUT / f"scene_{total:03d}_lesson_final.png")

            # Guardar manifiesto
            manifest_path = OUT / "manifest.json"
            manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

            # Generar índice HTML de revisión
            index_html = OUT / "index.html"
            rows = "\n".join(
                f"""
                <tr>
                  <td>{m['step']}</td>
                  <td>{m['focus_id']}</td>
                  <td>{m['kind']}</td>
                  <td>{m['section']}</td>
                  <td>{'✓' if m['required'] else ''}</td>
                  <td><a href="{m['teacher']}">Maestro</a></td>
                  <td><a href="{m['lesson']}">Lección</a></td>
                </tr>"""
                for m in manifest
            )
            index_html.write_text(
                f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visual Pass · IALP Clase 00</title>
<style>
body{{font-family:system-ui,-apple-system,sans-serif;margin:20px;background:#f5f7f8;color:#1d2630}}
h1{{font-size:22px;margin-bottom:6px}}
p{{margin:4px 0 16px;color:#65727d}}
table{{width:100%;border-collapse:collapse;font-size:13px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.06)}}
th,td{{padding:8px 10px;border:1px solid #d7d9d9;text-align:left}}
th{{background:#0f2b40;color:#fff;position:sticky;top:0}}
tr:nth-child(even) td{{background:#f8fafb}}
a{{color:#153b55}}
img{{max-width:120px;border:1px solid #d7d9d9;border-radius:4px}}
.cover-row td{{background:#fff8e8;font-weight:700}}
</style>
</head>
<body>
<h1>Final Visual Pass · IALP Clase 00 Mobile-First v1.1</h1>
<p>{total} pasos docentes + portada. Capturas: Maestro y Lección para cada escena.</p>
<p>Portada PDF: <a href="cover_pdf_portada.png">cover_pdf_portada.png</a> · Escena 0: <a href="scene_000_portada_teacher.png">scene_000_portada_teacher.png</a></p>
<table>
<thead>
<tr><th>Paso</th><th>focus_id</th><th>Tipo</th><th>Sección</th><th>Oblig.</th><th>Maestro</th><th>Lección</th></tr>
</thead>
<tbody>
<tr class="cover-row"><td>0</td><td>—</td><td>PORTADA</td><td>Portada / Pantalla principal</td><td></td><td><a href="scene_000_portada_teacher.png">Maestro</a></td><td>—</td></tr>
{rows}
</tbody>
</table>
</body>
</html>""",
                encoding="utf-8",
            )

            browser.close()
            print(f"\nVisual pass completo. Resultados en: {OUT}")
            print(f"  - {len(manifest)} escenas capturadas (×2 = Maestro + Lección)")
            print(f"  - Índice de revisión: {index_html}")
            print(f"  - Manifiesto: {manifest_path}")
    finally:
        server.terminate()
        try:
            server.wait(timeout=3)
        except Exception:
            server.kill()


if __name__ == "__main__":
    run()
