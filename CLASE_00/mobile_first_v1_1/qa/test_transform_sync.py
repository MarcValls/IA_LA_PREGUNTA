from pathlib import Path
import subprocess, sys

ROOT=Path(__file__).resolve().parents[1]
TRANSFORM=ROOT/'transform-mobile.mjs'
FRONTEND=ROOT/'frontend'/'index.html'
CAP_WEB=ROOT/'capacitor'/'web'/'index.html'

assert TRANSFORM.exists(), f"{TRANSFORM} missing"
assert FRONTEND.exists(), f"{FRONTEND} missing"

original=FRONTEND.read_bytes()
# Run the generator in-place.
result=subprocess.run(['node', str(TRANSFORM)], cwd=ROOT, capture_output=True, text=True)
assert result.returncode==0, f"transform-mobile.mjs failed: {result.stderr}\n{result.stdout}"
generated=FRONTEND.read_bytes()
assert generated==original, "transform-mobile.mjs changed frontend/index.html; generator is out of sync with inline source"
cap=CAP_WEB.read_bytes()
assert cap==generated, "capacitor/web/index.html differs from frontend/index.html after transform"
print('TRANSFORM_SYNC_QA PASS: generator is idempotent and capacitor bundle matches frontend')
