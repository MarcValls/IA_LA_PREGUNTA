# IA. LA PREGUNTA

Repositorio del curso **IA. LA PREGUNTA**. Cada clase vive en su propio directorio.

```text
.
├── README.md
├── .gitignore
├── CLASE_00/      ← Primera clase: "Antes de aprender a responder"
├── CLASE_01/      ← (próximamente)
└── ...
```

## Clase 00 — Antes de aprender a responder

La primera clase del curso, con tres versiones interactivas más el manual en PDF.

- `CLASE_00/desktop_fullstack_v1_6/` — escritorio 50/50 con backend Python + Ollama.
- `CLASE_00/desktop_offline_v1_8/` — escritorio 50/50 sin backend, sin IA, guion pregenerado.
- `CLASE_00/mobile_first_v1_8/` — versión mobile-first offline: HTML autocontenido, contenedor Capacitor y APK de debug incluido.
- `CLASE_00/Pdf_Versión-papel/` — manual del alumno en PDF.

## Cómo arrancar

Desde el directorio de la versión que quieras usar:

```powershell
cd CLASE_00\desktop_fullstack_v1_6
.\INICIAR_INTERACTIVO.ps1
```

## Notas

- No se versionan dependencias (`node_modules`), artefactos de build (`dist/`, `.apk`) ni capturas de QA.
- Cada nueva clase seguirá el mismo patrón: `CLASE_XX/` con sus versiones y documentación.
