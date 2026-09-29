# CAMBIOS v1.8 — MOBILE-FIRST

- Sustituye el responsive heredado por un reproductor de escenas semánticas en móvil.
- El móvil ya no muestra una lección/página completa: muestra exactamente el `focus_id` del paso actual.
- Dos superficies: `Maestro` y `Lección`.
- El nodo real de la lección se monta temporalmente en la escena móvil; no se clona, por lo que inputs, checks y gates conservan el mismo estado.
- Reflow obligatorio a una columna para grids didácticos.
- `overflow-wrap:anywhere` eliminado de la escena móvil: `break-word`, `word-break:normal`, `hyphens:none`.
- Touch targets >= 44 px e inputs >= 16 px.
- Sin autoavance; los gates siguen bloqueando `Siguiente`.
- Historial del Maestro compacto en móvil: últimos tres mensajes, con expansión opcional.
- Capacitor `web/index.html` usa exactamente la misma build móvil.
