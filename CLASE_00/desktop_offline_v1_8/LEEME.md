# IA. LA PREGUNTA — Clase 00 · Escritorio OFFLINE v1.8 (refinada)

Versión de escritorio sin backend, sin Ollama y sin conexión a red. Reproduce un guion docente pregenerado de 163 pasos con 12 puntos obligatorios.

## Arranque

En Windows ejecuta `INICIAR_INTERACTIVO.cmd` o `INICIAR_INTERACTIVO.ps1`. Abre directamente `frontend/index.html` en el navegador predeterminado.

## Aula sincronizada

La pantalla queda dividida exactamente 50/50:

`MAESTRO / CHAT  |  DOCUMENTO INTERACTIVO`

El Maestro ocupa la columna izquierda y la lección la derecha. No se requiere ningún servidor.

## Modo offline

- No necesita Python, ni backend, ni Ollama.
- El progreso se guarda en `localStorage` del navegador.
- Los puntos obligatorios bloquean el avance hasta completarse.
- Las pistas y comprobaciones vienen del guion pregenerado.

## Foco visual

Cuando el Maestro dice **Mira aquí** o pulsas **Siguiente**:

- el documento hace scroll hasta el fragmento exacto;
- las demás lecciones se atenúan;
- el fragmento activo recibe un borde dorado doble y una etiqueta `AHORA`;
- una flecha une el chat con el fragmento;
- el avatar del Maestro pulsa con un anillo dorado para llamar la atención.

## Controles

- `Siguiente` avanza al siguiente paso docente.
- `Anterior` vuelve al paso anterior.
- `Repetir` reproduce de nuevo el mensaje actual.
- `Reiniciar` vuelve al principio conservando tus respuestas.
- `Índice` permite saltar a lecciones ya desbloqueadas.

## Dependencias

Ninguna. Solo un navegador moderno.

## Alcance

Esta versión es exclusivamente de escritorio. La versión móvil vive en el repositorio `IA_LA_PREGUNTA`.
