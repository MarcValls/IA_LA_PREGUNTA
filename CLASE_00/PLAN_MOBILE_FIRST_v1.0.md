# PLAN MOBILE-FIRST — ESTADO MATERIALIZADO

## Objetivo
No adaptar páginas A4 al teléfono. Convertir la Clase 00 en una secuencia de escenas semánticas sincronizadas con el Maestro.

## Modelo
`PASO DOCENTE -> MAESTRO -> MIRA AQUÍ -> ESCENA ÚNICA -> GATE -> SIGUIENTE`

## Implementado
1. 163 pasos conservados.
2. Cada paso declara `mobile_scene.type`.
3. El `focus_id` es la unidad de restauración y navegación.
4. Una sola escena visible en la superficie Lección.
5. Nada de columnas 50/50 en móvil.
6. Sin avance automático.
7. Gates obligatorios mantienen bloqueado Siguiente.
8. Reflow a una columna.
9. Tipografía de lección y chat sigue siendo configurable.
10. Bundle copiado a Capacitor.

## Validación mínima antes de release
- 320x568, 360x800, 390x844, 412x915 y tablet 768x1024.
- tamaños de lectura 13, 16, 22 px.
- chat 12, 15, 22 px.
- todos los 12 gates.
- rotación portrait/landscape.
- Android WebView real.
