# IA. LA PREGUNTA — Clase 00 · Escritorio FULLSTACK v1.6 (refinada)

Versión de escritorio con backend local, persistencia SQLite y Maestro mediante Ollama.

## Arranque

En Windows ejecuta `INICIAR_INTERACTIVO.cmd`.

El lanzador busca un puerto libre desde `8765`, inicia el backend local y abre el navegador. No requiere paquetes Python externos.

## Configuración y Ollama

En la barra superior pulsa `Configuración`. Dentro de `IA LOCAL · OLLAMA`, pulsa `Conectar Ollama`.

Ollama se espera por defecto en `http://127.0.0.1:11434`. Al conectar, Configuración se cierra y el Maestro ocupa la columna izquierda con la mitad de la pantalla.

## Aula sincronizada

La pantalla queda dividida exactamente 50/50:

`MAESTRO / CHAT  |  DOCUMENTO INTERACTIVO`

El documento de la derecha es la reproducción HTML interactiva del manual. Permite hacer scroll hasta un fragmento exacto, atenuar el resto, iluminar únicamente el contenido observado y asociar ejercicios editables.

El Maestro avanza por **fragmentos didácticos**, no solo por lecciones. `Siguiente` mueve simultáneamente la conversación y el documento: esquema → ejemplo → idea clave → ejercicio → siguiente fragmento.

Cuando el profesor utiliza **Mira aquí**, la interfaz desplaza el documento, ilumina el fragmento exacto con un borde dorado doble y una etiqueta `AHORA`, y dibuja una flecha desde el chat hasta la zona observada.

## El Maestro llama la atención

- El avatar del Maestro muestra un anillo dorado animado y un pulso de luz cada vez que:
  - llega un nuevo mensaje del profesor;
  - cambia el fragmento activo (`Mira aquí`, `Siguiente`, etc.).
- El panel izquierdo se mantiene siempre visible; el alumno no puede perder de vista dónde está el foco.

## Chat enriquecido

El Maestro puede mostrar párrafos breves, negritas, listas, enlaces internos seguros, botones de acción y los controles `Mira aquí →`, `Otra explicación` y `Siguiente` cuando proceda.

Los controles generales de lección están agrupados en el desplegable `Lección · controles`.

## Ejercicios

Los ejercicios de la derecha siguen siendo editables. `Pedir pista al maestro` y `Entregar al maestro` utilizan la misma conversación pedagógica de la izquierda.

## Persistencia

SQLite se crea en `data/ialp_clase00.sqlite3`. El estado guarda respuestas, progreso, bloque actual y fragmento en foco. `localStorage` permanece como respaldo local del navegador.

## Dependencias

- Python 3.
- Ollama solo para el Maestro.
- Ninguna dependencia Python externa.

## Novedades v1.6 refinada

- Aula de escritorio dividida 50/50.
- Indicador visual de fragmento activo: borde dorado doble + etiqueta `AHORA`.
- Avatar del Maestro con anillo animado que pulsa al recibir mensajes o cambiar de foco.
- Tipografía del chat y de lectura ajustable desde Configuración.
- Esta versión es exclusivamente de escritorio; la versión móvil vive en el repositorio `IA_LA_PREGUNTA`.
