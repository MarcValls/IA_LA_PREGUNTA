#!/usr/bin/env python3
"""
IALP Mobile-First · Visual Pass por ADB
Requisitos: dispositivo Android conectado, adb, APK de debug con modo QA.

Flujo:
1. Limpia datos e inicia la app.
2. El modo QA auto-avance alterna Maestro/Lección cada ~2.4s.
3. Captura la pantalla cada ~1.0s mediante ADB.
4. Extrae las capturas y genera un índice de revisión.
"""

import subprocess, time, json, shutil, sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "qa" / "visual_pass_adb"
RAW = OUT / "raw"
ADB = Path(r"C:\Program Files (x86)\Android\android-sdk\platform-tools\adb.exe")
DEVICE = "DYSGFMLBWCW4GEQ8"
PKG = "com.marcvalls.ialapregunta"
ACTIVITY = f"{PKG}/.MainActivity"

# Ajustes de captura
CAPTURE_INTERVAL = 1.0       # segundos entre capturas
TOTAL_DURATION = 15 * 60     # 15 minutos de margen para 163 pasos × 2 paneles
REMOTE_DIR = "//sdcard/ialp_vp"


def adb(cmd):
    return subprocess.run([str(ADB), "-s", DEVICE] + cmd, capture_output=True, text=True)


def ensure_dirs():
    OUT.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)
    adb(["shell", "mkdir", "-p", REMOTE_DIR])


def restart_app():
    print("Reiniciando app...")
    adb(["shell", "am", "force-stop", PKG])
    time.sleep(0.5)
    adb(["shell", "pm", "clear", PKG])
    time.sleep(0.5)
    adb(["shell", "am", "start", "-n", ACTIVITY])


def capture_loop():
    count = 0
    start = time.time()
    next_pull = 10
    while time.time() - start < TOTAL_DURATION:
        remote = f"{REMOTE_DIR}/vp_{count:04d}.png"
        local = RAW / f"vp_{count:04d}.png"
        r = adb(["shell", "screencap", "-p", remote])
        if r.returncode != 0:
            print(f"  screencap error: {r.stderr}")
            time.sleep(0.2)
            continue
        # Pull cada N capturas para no acumular en memoria/remoto
        adb(["pull", remote, str(local)])
        adb(["shell", "rm", remote])
        count += 1
        if count % 20 == 0:
            print(f"  capturas: {count} · transcurrido: {int(time.time()-start)}s")
        time.sleep(max(0, CAPTURE_INTERVAL - (time.time() % CAPTURE_INTERVAL)))
    print(f"Total capturas: {count}")
    return count


def build_index(count):
    rows = []
    for i in range(count):
        p = RAW / f"vp_{i:04d}.png"
        if not p.exists():
            continue
        rows.append(f"""
        <tr>
          <td>{i+1}</td>
          <td><a href="raw/vp_{i:04d}.png" target="_blank"><img src="raw/vp_{i:04d}.png" loading="lazy"></a></td>
          <td>{datetime.fromtimestamp(p.stat().st_mtime).strftime('%H:%M:%S')}</td>
        </tr>""")
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visual Pass ADB · IALP Clase 00</title>
<style>
body{{font-family:system-ui,sans-serif;margin:20px;background:#f5f7f8;color:#1d2630}}
h1{{font-size:22px}}
p{{color:#65727d}}
table{{width:100%;border-collapse:collapse;font-size:13px;background:#fff}}
th,td{{padding:8px;border:1px solid #d7d9d9}}
th{{background:#0f2b40;color:#fff;position:sticky;top:0}}
img{{max-height:220px;border:1px solid #d7d9d9;border-radius:4px}}
a{{color:#153b55}}
</style>
</head>
<body>
<h1>Visual Pass ADB · {count} capturas</h1>
<p>Capturas automáticas del flujo mobile QA. Cada imagen alterna aproximadamente Maestro/Lección.</p>
<table>
<thead><tr><th>#</th><th>Captura</th><th>Hora</th></tr></thead>
<tbody>
{''.join(rows)}
</tbody>
</table>
</body>
</html>"""
    (OUT / "index.html").write_text(html, encoding="utf-8")


def main():
    if not ADB.exists():
        print(f"ADB no encontrado: {ADB}")
        sys.exit(1)
    devices = adb(["devices"]).stdout
    if DEVICE not in devices:
        print(f"Dispositivo {DEVICE} no conectado.\n{devices}")
        sys.exit(1)
    ensure_dirs()
    restart_app()
    print("Esperando activación QA (4s)...")
    time.sleep(4)
    print("Iniciando captura continua por ADB...")
    count = capture_loop()
    adb(["shell", "am", "force-stop", PKG])
    print("Generando índice...")
    build_index(count)
    print(f"\nVisual pass ADB completo: {OUT}")
    print(f"  Capturas: {count}")
    print(f"  Índice: {OUT / 'index.html'}")


if __name__ == "__main__":
    main()
