# IA. LA PREGUNTA — Clase 00

Directorio de versiones finales de la Clase 00 para escritorio.

```text
.
├── README.md
├── Pdf_Versión-papel/
├── desktop_fullstack_v1_6/
├── desktop_offline_v1_8/
└── mobile_first_v1_8/
```

## Versiones disponibles

### `desktop_fullstack_v1_6/`

- **Modo:** escritorio con backend Python + Ollama.
- **Arranque:** `INICIAR_INTERACTIVO.cmd`.
- **Características:** aula 50/50, Maestro local, fragmento activo resaltado, avatar con pulso de atención, persistencia SQLite.
- **Requiere:** Python 3 y Ollama para el Maestro.

### `desktop_offline_v1_8/`

- **Modo:** escritorio offline, sin backend, sin IA.
- **Arranque:** `INICIAR_INTERACTIVO.cmd`.
- **Características:** aula 50/50, guion docente pregenerado de 163 pasos, 12 puntos obligatorios, fragmento activo resaltado, avatar con pulso de atención, persistencia en `localStorage`.
- **Requiere:** solo un navegador moderno.

### `Pdf_Versión-papel/`

- Manual del alumno en PDF y modelo de maquetación dinámica.

### `mobile_first_v1_8/`

- **Modo:** offline con interfaz mobile-first y contenedor Capacitor.
- **Arranque:** `INICIAR_INTERACTIVO.cmd` (escritorio) o empaquetar `capacitor/web/` con Capacitor.
- **Características:** 163 pasos, 12 puntos obligatorios, dos superficies (Maestro y Lección), escena semántica por paso, persistencia local, no requiere IA.
- **Requiere:** navegador; para APK se necesita Android SDK.

## Cómo elegir

- Si quieres probar la experiencia completa con un profesor de IA local → usa `desktop_fullstack_v1_6/`.
- Si quieres algo portable, sin dependencias, para distribuir o proyectar → usa `desktop_offline_v1_8/`.
- Si quieres la experiencia móvil o construir el APK → usa `mobile_first_v1_8/`.

## Notas

- Las tres versiones comparten la misma base de contenido pero tienen interfaces y modos de ejecución distintos.
- Las versiones desktop han sido limpiadas de artefactos móviles; la versión móvil conserva su Capacitor para poder empaquetar.
- Se han aplicado reglas útiles de la versión móvil a la versión desktop: indicador de fragmento activo más visible, Maestro que llama la atención con un anillo dorado animado, y tipografía configurable.
