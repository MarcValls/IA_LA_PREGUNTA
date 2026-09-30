# QA MOBILE-FIRST v1.1

## PASS
- Simulation contract: 163 steps.
- Required gates: 12.
- `mobile_scene` metadata: 163/163.
- Future navigation remains locked.
- Auto-advance remains disabled.
- **Seen-before-next lock: the Maestro `Siguiente` button is disabled until the current step is marked as seen (desktop via “Mira aquí”, mobile via “Visto” in the Lección pane).**
- **Mobile Lección pane only shows `← Volver al Maestro` and `✓ Visto`; no inline “Siguiente”.**
- **Welcome tour present and syntax-valid: `ialp-tour` markup, CSS and runtime pass `node --check`; tour steps reference `Continuar`, `Mira aquí`, `Visto` and `Siguiente`.**
- JavaScript syntax: PASS (`node --check`).
- Existing OFFLINE_SIM_QA: PASS.
- Existing frontend static QA: PASS.
- **TRANSFORM_SYNC_QA: PASS — `transform-mobile.mjs` regenerates `frontend/index.html` and `capacitor/web/index.html` without changing the committed output.**
- Capacitor web bundle equals frontend bundle.
- Mobile scene host is not part of the original `.learning-section` sequence, so it does not alter focus IDs.
- Representative mobile components tested at 320x568 and 390x844: page-level horizontal overflow = 0.
- Mobile CSS uses `overflow-wrap: break-word`, `word-break: normal`, `hyphens: none` for the semantic scene.
- Multi-column didactic layouts reflow to one column.
- Touch targets specified >=44 px; form inputs >=16 px.

## VALIDACIÓN VISUAL REAL PENDIENTE
The sandbox browser blocks normal `file://` / localhost navigation for the full application runtime. The CSS/reflow preview was rendered in isolation, but final end-to-end WebView validation must be run on Windows/Android. This is not marked as a false PASS.

## Gate de release Android
Do not promote to mobile release until portrait/landscape checks pass on a real Android WebView at 320, 360, 390, 412 and tablet widths, and font sizes 13/16/22 (lesson) and 12/15/22 (chat).
