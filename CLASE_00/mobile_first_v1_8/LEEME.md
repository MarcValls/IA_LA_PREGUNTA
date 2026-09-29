# IA. LA PREGUNTA — Clase 00 · MOBILE-FIRST v1.8

Esta versión parte de OFFLINE_SIM v1.7 y materializa una interfaz móvil propia.

## Escritorio
Mantiene el aula 50/50: Maestro a la izquierda, lección a la derecha.

## Móvil
No comprime el escritorio. Usa dos superficies: **Maestro** y **Lección**. La lección muestra únicamente la escena semántica (`focus_id`) del paso actual. El nodo real se mueve a la escena, por lo que ejercicios y gates conservan estado.

## Inicio Windows
Ejecuta `INICIAR_INTERACTIVO.cmd`.

## Capacitor
La misma build está en `capacitor/web/index.html`.


## APK

Un APK de debug precompilado está disponible en:
`IA_LA_PREGUNTA_CLASE_00_MOBILE_FIRST_v1.8-debug.apk`

Para instalarlo en Android, transfiérelo al dispositivo y ábrelo; puede requerir habilitar "Orígenes desconocidos". Para generar una nueva build, usa el contenedor Capacitor con el Android SDK.

## Estado
- 163 pasos docentes.
- 12 puntos obligatorios.
- 0 autoavance.
- OFFLINE: no necesita IA.
- Mobile-first: implementado.
- APK: requiere Android SDK para compilar.
