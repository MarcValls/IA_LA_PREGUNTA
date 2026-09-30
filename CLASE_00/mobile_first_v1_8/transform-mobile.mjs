import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.dirname(__filename);
const FRONTEND_HTML = path.join(ROOT, 'frontend', 'index.html');
const CAP_WEB_HTML = path.join(ROOT, 'capacitor', 'web', 'index.html');

let html = fs.readFileSync(FRONTEND_HTML, 'utf8');

function extractBlock(source, startMarker, endMarker) {
  const s = source.indexOf(startMarker);
  if (s === -1) throw new Error('start marker not found: ' + startMarker);
  let e = source.indexOf(endMarker, s);
  if (e === -1) throw new Error('end marker not found after ' + startMarker);
  e += endMarker.length;
  return source.slice(s, e);
}

function replaceBlock(text, startMarker, endMarker, replacement) {
  const s = text.indexOf(startMarker);
  if (s === -1) throw new Error('start marker not found: ' + startMarker);
  let e = text.indexOf(endMarker, s);
  if (e === -1) throw new Error('end marker not found after ' + startMarker);
  e += endMarker.length;
  return text.slice(0, s) + replacement + text.slice(e);
}

// --- Read blocks from single source of truth (frontend/index.html) ---
const MOBILE_CSS = extractBlock(html, '<style id="ialp-mobile-first-v18-css">', '</style>');
const MOBILE_NEXT_FIX = extractBlock(html, '<style id="ialp-mobile-next-fix">', '</style>');
const OFFLINE_SIM_CSS = extractBlock(html, '<style id="ialp-offline-sim-style">', '</style>');
const MOBILE_RUNTIME = extractBlock(html, '<script id="ialp-mobile-first-v18-runtime">', '</script>');
const OFFLINE_RUNTIME = extractBlock(html, '<script id="ialp-offline-sim-runtime">', '</script>');

// --- Apply blocks idempotently into the same frontend HTML, then mirror to capacitor ---
html = replaceBlock(html, '<style id="ialp-mobile-first-v18-css">', '</style>', MOBILE_CSS);
html = replaceBlock(html, '<style id="ialp-mobile-next-fix">', '</style>', MOBILE_NEXT_FIX);
html = replaceBlock(html, '<style id="ialp-offline-sim-style">', '</style>', OFFLINE_SIM_CSS);
html = replaceBlock(html, '<script id="ialp-mobile-first-v18-runtime">', '</script>', MOBILE_RUNTIME);
html = replaceBlock(html, '<script id="ialp-offline-sim-runtime">', '</script>', OFFLINE_RUNTIME);

fs.writeFileSync(FRONTEND_HTML, html, 'utf8');
fs.writeFileSync(CAP_WEB_HTML, html, 'utf8');
console.log('PASS: mobile-first v1.1 integrated into frontend and capacitor/web');
