# IA. LA PREGUNTA — Arquitectura interactiva v1.6

## Modelo

```text
┌─────────────────────────────┬─────────────────────────────────────────────┐
│ MAESTRO / CHAT              │ DOCUMENTO HTML INTERACTIVO                 │
│                             │                                             │
│ Narración enriquecida       │ Fragmentos semánticos direccionables       │
│ Preguntas / feedback        │ Texto, esquemas, ejemplos, ejercicios      │
│ Botones y enlaces internos  │ Scroll automático                          │
│ "Mira aquí" ───────────────┼──────► foco + iluminación exacta            │
└─────────────────────────────┴─────────────────────────────────────────────┘
                 │                         │
                 └──────── FRONTEND ───────┘
                            │
                    BACKEND PYTHON
                     /            \
                  SQLite         Ollama
                              127.0.0.1:11434
```

## Sincronización profesor-documento

Al cargar la clase, el frontend construye una secuencia de `focus_id` sobre unidades semánticas del documento. La granularidad combina bloques completos con subbloques relevantes —por ejemplo paneles, escenas, casos y pasos— sin fragmentar cada palabra o cada línea.

Cada petición al Maestro incluye:

- lección actual;
- `focus_id`;
- etiqueta del foco;
- texto exacto del fragmento;
- ejercicio relacionado;
- respuesta actual del alumno.

El backend devuelve el mismo `focus_id`. La interfaz conserva por tanto autoridad sobre qué fragmento es el activo y no permite que una respuesta del LLM apunte arbitrariamente a un selector DOM.

## Foco visual

Cuando se activa un fragmento:

1. el documento hace scroll hasta él;
2. las demás lecciones se atenúan;
3. los demás fragmentos de la lección se atenúan;
4. el objetivo recibe el estado `teacher-focus-target`;
5. el fragmento activo se ilumina con un borde dorado doble y una etiqueta `AHORA`;
6. el avatar del Maestro pulsa con un anillo dorado para llamar la atención;
7. `Mira aquí` en el mensaje se convierte en control interactivo;
8. una flecha SVG une el límite del chat con el fragmento activo.

La flecha es puramente visual y no captura eventos.

## Progresión

`Siguiente` avanza al siguiente `focus_id`. El cambio de lección solo ocurre cuando se supera el último fragmento de la anterior. `Ejercicio` busca el siguiente fragmento que contiene una actividad.

## Chat enriquecido

No se inserta HTML producido por el modelo. El cliente renderiza una gramática segura y limitada: párrafos, listas, `**negrita**`, `código` y enlaces internos `#id`. Las acciones ejecutables están predefinidas y validadas por la interfaz.

## Frontera Ollama

El navegador no llama a Ollama. Toda IA pasa por el backend ligado a `127.0.0.1`. El modelo recibe contexto didáctico, pero no selectores CSS ni capacidad de ejecutar código en el navegador.

## Layout v1.6 refinado

En escritorio, con el Maestro activo, la aplicación usa una división exacta 50/50: chat a la izquierda y contenido a la derecha. `--teacher-chat-font-size` controla la tipografía del chat y `--lesson-text-font-size` controla la tipografía de lectura de la lección. Ambas preferencias se persisten en `state.ui`.

El avatar del Maestro incluye un indicador de atención: un anillo dorado animado y un pulso de luz se activan cuando llega un mensaje nuevo o cambia el fragmento activo, de modo que el alumno no pierda de vista la sincronización entre la conversación y el documento.

## Alcance desktop

Esta versión está pensada exclusivamente para escritorio. La versión móvil se mantiene en el repositorio `IA_LA_PREGUNTA`, con su propia adaptación de interfaz y su plan de bridge de backend.
