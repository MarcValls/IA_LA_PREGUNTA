# Capacitor — MOBILE-FIRST v1.1

Empaqueta `frontend/index.html` como aplicación Android.

## Requisitos

- Node.js 22+
- Android SDK
- JDK 21

## Flujo de build

```powershell
npm install
npm run mobile:prepare   # copia frontend/ -> capacitor/web/
npm run cap:sync:android # sincroniza assets con Android
.\scripts\build-debug.ps1  # gradlew assembleDebug
```

El APK resultante se genera en `android/app/build/outputs/apk/debug/app-debug.apk`.

## Notas

- `capacitor/web/` se regenera automáticamente; no editar a mano.
- La app funciona offline: el guion del Maestro y los gates están embebidos en el HTML.
