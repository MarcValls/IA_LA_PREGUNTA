# IA. LA PREGUNTA

Repositorio del curso **IA. LA PREGUNTA**. Cada clase vive en su propio directorio.

## Estructura

```text
.
├── README.md
├── .gitignore
└── CLASE_00/      ← Primera clase: "Antes de aprender a responder"
```

## Clase 00 · MOBILE-FIRST v1.8

- 163 pasos docentes, 12 puntos obligatorios, 0 autoavance.
- Modo offline: no requiere IA ni conexión.
- Escritorio: aula 50/50 (Maestro + Lección).
- Móvil: dos superficies propias, Maestro y Lección.
- Entrada web: `CLASE_00/frontend/index.html`.
- Contenedor Android: `CLASE_00/capacitor/`.

### Cómo arrancar (Windows)

Ejecuta desde el directorio de la clase:

```powershell
cd CLASE_00
.\INICIAR_INTERACTIVO.ps1
```

O desde CMD:

```cmd
cd CLASE_00
INICIAR_INTERACTIVO.cmd
```

Eso levanta el backend ligero en `http://127.0.0.1:8765/` y abre el aula.

## Notas

- No se versionan dependencias (`node_modules`), artefactos de build (`dist/`, `.apk`) ni capturas de QA.
- Cada nueva clase debería seguir la misma estructura: `CLASE_XX/` con su propio `frontend/`, `backend/` (si lo necesita), `simulation/` y documentación.
