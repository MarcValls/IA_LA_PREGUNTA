# IA. LA PREGUNTA — Clase 00 · MOBILE-FIRST v1.1

Versión móvil offline determinista de la Clase 00.

## Contenido

- `frontend/index.html` — aplicación principal (HTML autocontenido, offline).
- `frontend/assets/titulo.png` — imagen de cabecera.
- `capacitor/` — contenedor Android para reconstruir el APK.
- `IA_LA_PREGUNTA_CLASE_00_MOBILE_FIRST_v1.1-debug.apk` — APK de debug precompilado.
- `manifest.json` — metadatos de la entrega.
- `MOBILE_SCENE_CONTRACT_v1.0.json` — contrato de escenas móviles.

## Cómo usar

### Escritorio / navegador

Abre `frontend/index.html` directamente en un navegador. No requiere servidor ni IA.

### Android (APK existente)

Transfiere `IA_LA_PREGUNTA_CLASE_00_MOBILE_FIRST_v1.1-debug.apk` al dispositivo e instálalo. Puede ser necesario habilitar "Orígenes desconocidos".

### Reconstruir el APK

Desde `capacitor/`:

```powershell
npm install
npm run cap:sync:android
npx cap open android
# O directamente:
.\scripts\build-debug.ps1
```

Requiere Node.js 22+, Android SDK y JDK 21.

## Flujo de aprendizaje

1. El Maestro presenta cada paso con un mensaje y un botón **Mira aquí**.
2. En **escritorio**, el fragmento se ilumina al pulsar **Mira aquí**.
3. En **móvil**, **Mira aquí** abre la superficie **Lección**, donde se muestra exactamente el fragmento correspondiente.
4. Tras revisar la escena, el alumno pulsa **✓ Visto** (móvil) o ya quedó registrado al pulsar **Mira aquí** (escritorio).
5. Solo entonces se habilita **Siguiente** en el Maestro.
6. Los 12 puntos obligatorios siguen requiriendo completar la actividad antes de poder continuar.

Este flujo evita avanzar por la clase sin haber visto el fragmento.

La primera vez que se abre la app, un **tour de bienvenida** indica dónde pulsar en cada momento. Se puede reiniciar desde **Configuración**.

## Estado

- 163 pasos docentes.
- 12 puntos obligatorios.
- 0 autoavance.
- Sin backend, sin Ollama.
- Mobile-first implementado.
