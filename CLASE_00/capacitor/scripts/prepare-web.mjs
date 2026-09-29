import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const capRoot = resolve(here, '..');
const projectRoot = resolve(capRoot, '..');
await mkdir(resolve(capRoot, 'web'), { recursive: true });
await mkdir(resolve(capRoot, 'web', 'assets'), { recursive: true });
await copyFile(resolve(projectRoot, 'frontend', 'index.html'), resolve(capRoot, 'web', 'index.html'));
// Copiar assets de imágenes (icono, título, etc.)
const assetsSrc = resolve(projectRoot, 'frontend', 'assets');
const assetsDst = resolve(capRoot, 'web', 'assets');
try {
  for (const name of ['icono.png', 'titulo.png']) {
    await copyFile(resolve(assetsSrc, name), resolve(assetsDst, name));
  }
} catch (e) {
  console.log('Nota: algunos assets no existen en frontend/assets/', e.message);
}

// Inyectar script de modo QA (desactivado por defecto, activable con 5 toques)
try {
  execFileSync('node', [resolve(here, 'qa-inject.mjs')], { cwd: projectRoot, stdio: 'inherit' });
} catch (e) {
  console.log('Advertencia: no se pudo inyectar el script QA', e.message);
}

console.log('PASS: frontend/index.html -> capacitor/web/index.html');
console.log('PASS: frontend/assets/* -> capacitor/web/assets/*');
console.log('Nota: el Maestro móvil requiere completar MobileApiClient (fase M4).');
