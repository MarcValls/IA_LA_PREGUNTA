import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const capRoot = resolve(here, '..');
const projectRoot = resolve(capRoot, '..');

const htmlPath = resolve(projectRoot, 'frontend', 'index.html');
const outPath = resolve(capRoot, 'web', 'index.html');

const QA_SCRIPT = `
<script id="ialp-qa-mode">
(() => {
  // MODO QA / VISUAL PASS
  // Se activa con 5 toques rápidos en la esquina superior derecha.
  // Una vez activo, la app avanza sola alternando Maestro/Lección y
  // desbloquea automáticamente los puntos obligatorios.
  let taps = [];
  let active = false;
  let currentPane = 'teacher';
  const CORNER_SIZE = 120;
  const TAP_WINDOW = 900;
  const REQUIRED_TAPS = 5;

  function log(msg) {
    console.log('[IALP-QA]', msg);
  }

  function unlockCurrentGate() {
    try {
      const ctl = window.IALPOfflineControls;
      if (!ctl) return;
      const step = ctl.currentStep();
      if (!step || !step.gate) return;
      const key = 'ialp.clase00.mobilefirst.sim.v1.8';
      let st = JSON.parse(localStorage.getItem(key) || '{}');
      st.completed = st.completed || {};
      st.completed[step.index] = true;
      st.maxUnlocked = Math.max(st.maxUnlocked || 0, step.index);
      localStorage.setItem(key, JSON.stringify(st));
      // Refrescar gate UI
      if (window.IALPMobileFirst) {
        window.IALPMobileFirst.gate(step, { passed: true, text: 'QA auto-unlock' });
      }
      const nextBtn = document.getElementById('mf-next');
      if (nextBtn) nextBtn.disabled = false;
      const offlineGate = document.getElementById('offline-sim-gate');
      if (offlineGate) offlineGate.hidden = true;
    } catch (e) {
      log('unlock error: ' + e.message);
    }
  }

  function setQABadge(stepIndex, pane) {
    const shell = document.getElementById('ialp-mobile-classroom') || document.body;
    let badge = document.getElementById('ialp-qa-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'ialp-qa-badge';
      badge.style.cssText = 'position:fixed;right:6px;top:76px;z-index:10000;background:#c9a64a;color:#0f2b40;font-size:11px;font-weight:900;padding:4px 8px;border-radius:6px;pointer-events:none;opacity:.92;box-shadow:0 2px 8px rgba(0,0,0,.2);display:none;';
      shell.appendChild(badge);
    }
    const s = stepIndex == null ? '' : String(stepIndex).padStart(3, '0');
    const p = pane ? pane[0].toUpperCase() : '-';
    badge.textContent = active ? ('QA ' + s + p) : 'QA OFF';
    badge.style.display = active ? 'block' : 'none';
  }

  function getStepIndex() {
    try {
      const ctl = window.IALPOfflineControls;
      if (ctl && ctl.currentStep) {
        const st = ctl.currentStep();
        return st ? st.index : 0;
      }
    } catch (e) {}
    return 0;
  }

  function advanceLoop() {
    if (!active) return;
    unlockCurrentGate();
    // Alternar pane
    currentPane = currentPane === 'teacher' ? 'lesson' : 'teacher';
    if (window.IALPMobileFirst && window.IALPMobileFirst.setPane) {
      window.IALPMobileFirst.setPane(currentPane);
    } else if (window.IALPOfflineControls) {
      // Fallback: mobile surface switch
      const btn = document.querySelector('[data-mf-pane="' + currentPane + '"]');
      if (btn) btn.click();
    }
    setQABadge(getStepIndex(), currentPane);
    // Si volvemos a Maestro, avanzamos al siguiente paso
    if (currentPane === 'teacher') {
      setTimeout(() => {
        if (!active) return;
        unlockCurrentGate();
        if (window.IALPOfflineControls && window.IALPOfflineControls.advance) {
          window.IALPOfflineControls.advance();
        } else {
          const nextBtn = document.getElementById('mf-next') || document.getElementById('teacher-next');
          if (nextBtn && !nextBtn.disabled) nextBtn.click();
        }
        setTimeout(() => setQABadge(getStepIndex(), 'teacher'), 100);
      }, 200);
    }
  }

  function enableQA() {
    if (active) return;
    active = true;
    window.IALP_QA_SKIP_GATES = true;
    log('QA mode ENABLED');
    setQABadge(getStepIndex(), 'teacher');
    // Asegurar que empezamos en Maestro
    currentPane = 'teacher';
    if (window.IALPMobileFirst) window.IALPMobileFirst.setPane('teacher');
    // Desbloquear todo
    try {
      const SIM = JSON.parse(document.getElementById('ialp-offline-sim-data').textContent);
      const key = 'ialp.clase00.mobilefirst.sim.v1.8';
      let st = JSON.parse(localStorage.getItem(key) || '{}');
      st.stepIndex = 0;
      st.maxUnlocked = SIM.steps.length;
      st.completed = {};
      SIM.steps.forEach(s => { if (s.gate) st.completed[s.index] = true; });
      localStorage.setItem(key, JSON.stringify(st));
      if (window.IALPOfflineControls && window.IALPOfflineControls.goTo) {
        window.IALPOfflineControls.goTo(0, { narrate: false, allowBackward: true });
      }
    } catch (e) { log(e.message); }
    // Bucle de avance: 1.4s por pane da tiempo a que ADB capture limpio
    setInterval(advanceLoop, 1400);
  }

  // Activación por 5 toques en esquina superior derecha.
  document.addEventListener('pointerdown', (e) => {
    if (e.clientX < window.innerWidth - CORNER_SIZE || e.clientY > CORNER_SIZE) return;
    const now = Date.now();
    taps = taps.filter(t => now - t < TAP_WINDOW);
    taps.push(now);
    if (taps.length >= REQUIRED_TAPS) {
      taps = [];
      enableQA();
    }
  }, { passive: true });

  // Activación QA por tecla 'Q' 3 veces rápido (uso interno ADB/QA).
  let keyTaps = [];
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'q' && e.key !== 'Q') return;
    const now = Date.now();
    keyTaps = keyTaps.filter(t => now - t < TAP_WINDOW);
    keyTaps.push(now);
    if (keyTaps.length >= 3) {
      keyTaps = [];
      enableQA();
    }
  });

  function disableQA() {
    active = false;
    window.IALP_QA_SKIP_GATES = false;
    setQABadge(getStepIndex(), 'teacher');
    log('QA mode DISABLED');
  }

  // También permitir activación por consola/remoto: window.IALP_QA_ENABLE()
  window.IALP_QA_ENABLE = enableQA;
  window.IALP_QA_DISABLE = disableQA;
  window.IALP_QA_STATUS = () => active;
  // Ir exacto a un paso (0-based index) para QA/visual pass
  window.IALP_QA_GOTO = (index) => {
    if (!active) enableQA();
    try {
      if (window.IALPOfflineControls && window.IALPOfflineControls.goTo) {
        window.IALPOfflineControls.goTo(index, { narrate: false, allowBackward: true });
        if (window.IALPMobileFirst) window.IALPMobileFirst.setPane('teacher');
      }
    } catch (e) { log('goto error: ' + e.message); }
  };

  setQABadge(0, 'teacher');
  log('QA injector loaded. Activate with five taps or window.IALP_QA_ENABLE().');
})();
</script>
`;

const html = await readFile(htmlPath, 'utf-8');
const injected = html.replace(/<\/body>/i, QA_SCRIPT + '</body>');
await writeFile(outPath, injected, 'utf-8');
console.log('PASS: QA script injected ->', outPath);
