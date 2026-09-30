# CAMBIOS v1.1 — MOBILE-FIRST

- Sustituye el responsive heredado por un reproductor de escenas semánticas en móvil.
- El móvil ya no muestra una lección/página completa: muestra exactamente el `focus_id` del paso actual.
- Dos superficies: `Maestro` y `Lección`.
- El nodo real de la lección se monta temporalmente en la escena móvil; no se clona, por lo que inputs, checks y gates conservan el mismo estado.
- Reflow obligatorio a una columna para grids didácticos.
- `overflow-wrap:anywhere` eliminado de la escena móvil: `break-word`, `word-break:normal`, `hyphens:none`.
- Touch targets >= 44 px e inputs >= 16 px.
- Sin autoavance; los gates siguen bloqueando `Siguiente`.
- **Flujo “Mira aquí → Visto → Siguiente”**: en móvil, el botón `Siguiente` del Maestro permanece bloqueado hasta que el alumno abre la escena en la superficie `Lección` y pulsa `Visto`. En escritorio, el paso se marca como visto al pulsar `Mira aquí`. Esto evita avanzar sin haber visto el fragmento.
- **Tour de bienvenida guiado**: la primera vez que se abre la app se muestra un paseo interactivo que indica dónde pulsar en cada momento (Continuar, Maestro, Mira aquí, Visto, Siguiente). Se persiste en `localStorage` y se puede reiniciar desde Configuración.
- Historial del Maestro compacto en móvil: últimos tres mensajes, con expansión opcional.
- Capacitor `web/index.html` usa exactamente la misma build móvil.
