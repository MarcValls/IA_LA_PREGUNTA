# Capacitor — OFFLINE SIMULATION v1.7

Esta carpeta empaqueta la misma clase pregenerada incluida en `frontend/index.html`.

## Propiedad clave

El modo móvil de esta entrega **no necesita Ollama ni backend** para impartir la lección. El guion del Maestro, los focos, las pistas y los gates están embebidos en `web/index.html`.

## Flujo

```powershell
npm install
npm run cap:add:android
npm run cap:sync:android
npx cap open android
```

En móvil la interfaz usa dos superficies `Maestro` / `Lección`. Solo se muestra el fragmento semántico actual, evitando dejar una lección física a medias por el alto de pantalla.

`STATUS.json` distingue entre `web READY` y el proyecto Android todavía no materializado.
