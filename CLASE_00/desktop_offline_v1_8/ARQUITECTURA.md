# IA. LA PREGUNTA — Arquitectura interactiva · Escritorio OFFLINE v1.8

## Modelo

```text
┌─────────────────────────────┬─────────────────────────────────────────────┐
│ MAESTRO / CHAT              │ DOCUMENTO HTML INTERACTIVO                 │
│                             │                                             │
│ Guion pregenerado           │ Fragmentos semánticos direccionables       │
│ Preguntas / feedback        │ Texto, esquemas, ejemplos, ejercicios      │
│ Botones y enlaces internos  │ Scroll automático                          │
│ "Mira aquí" ───────────────┼──────► foco + iluminación exacta            │
└─────────────────────────────┴─────────────────────────────────────────────┘
                 │                         │
                 └──────── FRONTEND ───────┘
                            │
                     localStorage (progreso)
```

## Sincronización profesor-documento

Al cargar la clase, el frontend construye una secuencia de `focus_id` sobre unidades semánticas del documento. Cada paso del guion offline apunta a un `focus_id` concreto.

El Maestro avanza manualmente. La interfaz tiene autoridad total sobre qué fragmento es el activo: nunca delega ese control a HTML generado dinámicamente.

## Foco visual

Cuando se activa un fragmento:

1. el documento hace scroll hasta él;
2. las demás lecciones se atenúan;
3. los demás fragmentos de la lección se atenúan;
4. el objetivo recibe el estado `teacher-focus-target`;
5. el fragmento activo se ilumina con borde dorado doble y etiqueta `AHORA`;
6. el avatar del Maestro pulsa con un anillo dorado;
7. `Mira aquí` en el mensaje se convierte en control interactivo;
8. una flecha SVG une el límite del chat con el fragmento activo.

La flecha es puramente visual y no captura eventos.

## Progresión

`Siguiente` avanza al siguiente paso del guion. Los puntos obligatorios bloquean el avance hasta que el alumno completa la actividad y la registra.

No hay autoavance: el alumno controla el ritmo.

## Chat enriquecido

El Maestro offline renderiza una gramática segura y limitada: párrafos, listas, `**negrita**`, `código` y enlaces internos `#id`. Las acciones ejecutables están predefinidas y validadas por la interfaz.

## Persistencia

El estado se guarda en `localStorage`. No se usa backend ni SQLite. Las respuestas, checks y progreso permanecen en el navegador.

## Layout

En escritorio la aplicación usa una división exacta 50/50: chat a la izquierda y contenido a la derecha. `--teacher-chat-font-size` y `--lesson-text-font-size` se ajustan desde Configuración.

## Alcance

Versión exclusivamente de escritorio. Sin backend, sin Ollama, sin conexión. La versión móvil y el contenedor Android se mantienen en el repositorio `IA_LA_PREGUNTA`.
