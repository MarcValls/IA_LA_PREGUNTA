import { readFile, writeFile, mkdtemp, unlink, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const capRoot = resolve(here, '..');
const projectRoot = resolve(capRoot, '..');
const iconSrc = resolve(projectRoot, 'frontend', 'assets', 'icono.png');
const resRoot = resolve(capRoot, 'android', 'app', 'src', 'main', 'res');

const sizes = [
  ['mipmap-mdpi', 48],
  ['mipmap-hdpi', 72],
  ['mipmap-xhdpi', 96],
  ['mipmap-xxhdpi', 144],
  ['mipmap-xxxhdpi', 192],
];

async function main() {
  const pythonExe = process.env.PYTHON || 'python';
  const tmpDir = await mkdtemp(resolve(tmpdir(), 'ialp-icon-'));
  const pyScript = resolve(tmpDir, 'resize.py');
  await writeFile(pyScript, `
from PIL import Image
import sys
src, dst, size = sys.argv[1], sys.argv[2], int(sys.argv[3])
img = Image.open(src).convert('RGBA')
img = img.resize((size, size), Image.LANCZOS)
img.save(dst, 'PNG')
`, 'utf-8');

  try {
    for (const [folder, size] of sizes) {
      const dst = resolve(resRoot, folder, 'ic_launcher.png');
      const dstRound = resolve(resRoot, folder, 'ic_launcher_round.png');
      const dstFg = resolve(resRoot, folder, 'ic_launcher_foreground.png');
      execFileSync(pythonExe, [pyScript, iconSrc, dst, String(size)], { stdio: 'pipe' });
      execFileSync(pythonExe, [pyScript, iconSrc, dstRound, String(size)], { stdio: 'pipe' });
      execFileSync(pythonExe, [pyScript, iconSrc, dstFg, String(size)], { stdio: 'pipe' });
      console.log(`PASS: ${folder} ${size}x${size}`);
    }
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }

  // Adaptive icon definitions
  const anydpi = resolve(resRoot, 'mipmap-anydpi-v26');
  await writeFile(resolve(anydpi, 'ic_launcher.xml'), `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>\n`, 'utf-8');
  await writeFile(resolve(anydpi, 'ic_launcher_round.xml'), `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>\n`, 'utf-8');

  // Color de fondo
  const valuesDir = resolve(resRoot, 'values');
  const colorsPath = resolve(valuesDir, 'colors.xml');
  let colors = await readFile(colorsPath, 'utf-8').catch(() => '<resources>\n</resources>');
  if (!colors.includes('ic_launcher_background')) {
    colors = colors.replace('</resources>', '  <color name="ic_launcher_background">#0D2A3D</color>\n</resources>');
    await writeFile(colorsPath, colors, 'utf-8');
  }

  console.log('PASS: adaptive icon definitions updated');
}

main().catch(e => { console.error(e); process.exit(1); });
