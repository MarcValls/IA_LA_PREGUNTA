# IALP — MODELO DE MAQUETACIÓN DINÁMICA PARA ALUMNOS v1.4

## Estado

CONSOLIDADO A PARTIR DE CLASE 00 v0.6 · HERO FAMILY AUDIT

Este modelo gobierna la maquetación del **Manual del alumno** de `IA. LA PREGUNTA`. Se aplica junto al `IALP_KIT_MAQUETACION_EDITORIAL_v1.0`, que conserva la identidad visual general del proyecto.

## Principio central

No se maqueta una sucesión de párrafos. Primero se identifica **qué estructura semántica y pedagógica forman esos párrafos juntos** y después se elige una composición visual capaz de hacer visible esa estructura.

Cadena de trabajo obligatoria:

`FUENTE → PRESERVACIÓN DOCTRINAL → FUNCIÓN PEDAGÓGICA → PATRÓN SEMÁNTICO → SEMANTIC COMPACTION → COMPOSICIÓN → FAMILY AUDIT → ESTABILIDAD PDF → LINTER → QA VISUAL`

## 1. Preservación doctrinal

La maquetación puede añadir una capa didáctica —ejercicios, etiquetas, espacios de trabajo, preguntas de comprobación, mapas o laboratorios—, pero no puede sustituir silenciosamente el contenido fuente.

Regla de cierre: **cobertura literal de la fuente = 100 %** salvo que el usuario autorice una adaptación o reescritura.

Una frase fuente puede cambiar de posición para integrarse en un esquema, una tarjeta o una secuencia, pero no desaparecer.

## 2. Clasificación previa del contenido

Antes de componer, cada bloque se clasifica por su función dominante:

- `ENGANCHAR`: escena, pregunta detonante, sorpresa.
- `NARRAR`: explicación continua que necesita lectura fluida.
- `COMPARAR`: dos o más estados, opciones, lecturas o escenarios.
- `SECUENCIAR`: proceso, cadena causal, fases o evolución.
- `TRANSFORMAR`: estado inicial → expresión/acción → estado esperado.
- `DEMOSTRAR`: caso resuelto que prueba una idea.
- `FIJAR`: principio, frontera, advertencia o idea clave.
- `PRACTICAR`: ejercicio con respuesta del alumno.
- `EXPERIMENTAR`: laboratorio con Codex, Copilot, Pi u otro asistente.
- `VERIFICAR`: checkpoint, autoevaluación o criterio de salida.
- `RESPIRAR`: interludio visual deliberado entre bloques de alta densidad.

## 3. Semantic Compaction

Se considera fallo editorial cualquier serie de fragmentos cortos que pertenezcan al mismo patrón lógico y sigan apareciendo como párrafos independientes.

Ejemplos que deben compactarse:

- `Si pregunto… / estado inicial… / estado esperado…` → matriz de transformaciones.
- misma frase en cuatro contextos → escenas comparables.
- lista de posibilidades → matriz o abanico de alternativas.
- pasos mentales consecutivos → flujo numerado.
- literalidad / zona adecuada / sobreinterpretación → espectro.
- antes / después → contraste visual.

### Regla de linter semántico

Tres o más párrafos directos, breves y consecutivos que describen una misma estructura lógica = `FAIL` hasta justificar por qué deben seguir siendo prosa.

## 4. Ritmo de las lecciones

Cada **Lección 1–8** comienza en página nueva. Una lección no puede aparecer accidentalmente a mitad de página porque el bloque anterior dejara espacio.

Antes de una nueva lección puede existir un `INTERLUDIO` si cumple una función pedagógica clara. El interludio debe ocupar la página como composición deliberada; nunca puede parecer una página medio vacía causada por paginación.

El espacio blanco solo es válido cuando es funcional:

- área para escribir;
- pausa de reflexión;
- interludio focal;
- cierre;
- respiración alrededor de una pieza visual dominante.

Una página con gran superficie vacía sin función explícita = `FAIL`.

## 5. Gramática visual

La variedad se obtiene cambiando la **función de la página**, no decorando cada párrafo de una forma distinta.

Patrón de ritmo recomendado:

`ENGANCHE → MAPA → EXPLICACIÓN → CASO/CONTRASTE → IDEA CLAVE → PRÁCTICA → RESPIRACIÓN → CHECKPOINT`

No tiene que aparecer completo en cada lección. Se escogen solo los componentes que la lógica necesita.

### Familias visuales

- Azul marino: preguntas detonantes, interludios, cambios de escala, piezas de alta jerarquía.
- Dorado: transición, foco, idea estructural, conexión.
- Azul/gris claro: método, explicación, espacio de trabajo.
- Verde suave: ejemplo resuelto, lectura adecuada, operación esperada.
- Rojo suave: frontera, riesgo, sobreinterpretación, fallo.
- Morado: laboratorio IA, metacognición, contraste experimental.

El color codifica función. No se utiliza solo para variar la apariencia.

## 6. Texto y legibilidad

No se permite auto-hifenación en elementos diseñados.

`hyphens: none` es la regla por defecto para tarjetas, matrices, diagramas y composiciones de aprendizaje.

Una palabra no puede convertirse en una columna vertical por falta de anchura.

Una tarjeta estrecha debe rediseñarse antes de reducir el texto hasta perder legibilidad.

Regla práctica: si una estructura exige más de 4–5 columnas con texto real, convertirla en dos filas, secuencia o tabla, no forzarla horizontalmente.

## 7. Seguridad del renderer PDF

Para piezas críticas de impresión no se confía en CSS Grid si el motor PDF puede fragmentarlo de forma distinta al navegador.

Orden de preferencia:

1. HTML `table` para tablas reales.
2. `display: table` / `table-row` / `table-cell` para pares y secuencias controladas.
3. `inline-block` para tarjetas que puedan organizarse en dos filas.
4. bloques normales para interludios y paneles.
5. CSS Grid solo si se ha demostrado estable en el renderer objetivo y en la verificación final.

Todo componente complejo debe usar `break-inside: avoid` cuando su fragmentación destruya el significado.

## 8. Ejercicios

El espacio de respuesta debe reflejar la tarea.

- Una comparación exige columnas o campos comparables.
- Evidencia / información necesaria / suposición exige una hoja estructurada, no un rectángulo vacío.
- Una transformación exige estado inicial / expresión / estado esperado.
- Una reflexión abierta sí puede usar líneas o área libre.

No añadir espacios vacíos arbitrarios solo para llenar página.

## 9. Laboratorios con IA

Los laboratorios con Codex, Copilot, Pi u otros asistentes deben hacer observable un concepto de la lección.

Patrón:

`MISMA ENTRADA → CAMBIAR UNA SOLA VARIABLE → OBSERVAR CONDUCTA → REGISTRAR DIFERENCIAS → EXPLICAR QUÉ CAMBIÓ`

No se pide “qué IA es mejor” salvo que la lección trate explícitamente de evaluación comparativa. Se compara conducta respecto al concepto estudiado.

## 10. Interludios

Un interludio es una herramienta pedagógica, no una página de relleno.

Puede utilizarse para:

- ralentizar el ritmo;
- fijar una frase clave;
- marcar un cambio de escala;
- separar comprensión de acción;
- preparar la siguiente lección.

Debe tener una idea central grande y una composición simple. No debe convertirse en otra página densa.

## 11. Gates de cierre

Una entrega no se considera maquetada hasta superar:

### CONTENT PASS
- Cobertura literal de fuente: `100 %`.
- Contenido añadido identificado como capa didáctica, no sustitución doctrinal.

### SEMANTIC PASS
- Series breves residuales detectadas por linter: `0`.
- No hay texto lineal cuando existe una estructura comparativa, secuencial o causal evidente.

### LAYOUT PASS
- Bloques de texto anormalmente estrechos: `0`.
- Texto fuera de página: `0`.
- Caracteres corruptos: `0`.
- Candidatos a auto-hifenación de final de línea: `0`.
- Todas las lecciones comienzan en zona superior de página.

### VISUAL PASS
- Revisión de todas las páginas mediante contact sheet.
- Revisión ampliada de páginas complejas.
- Verificación con al menos un renderer; en composiciones sensibles, contraste PDFium + pdftoppm.


## 12. Familia HERO: portada, interludios y tesis de página completa

Las piezas de alta jerarquía se auditan como una **familia estructural**, no como páginas aisladas. La familia `HERO` incluye:

- portada;
- interludios que ocupan la mayor parte de una página;
- tesis de cierre;
- cambios de escala visual equivalentes.

### Zona segura

Todo texto de portada debe pertenecer al mismo sistema de alineación. Ninguna clase secundaria puede escapar del margen por no estar incluida en el selector principal.

Regla mínima: texto principal dentro de una zona segura de al menos 18 mm respecto al borde físico de la página.

### Ocupación deliberada

Una pieza `HERO` no puede usar `min-height` o altura fija si el contenido queda concentrado en un extremo y el resto de la superficie carece de función.

Si la pieza ocupa gran parte de la página, debe existir una estrategia explícita de distribución:

- eje vertical;
- secuencia;
- contraste;
- ancla gráfica;
- conclusión inferior;
- espacio de respiración claramente intencional.

Gran vacío sin función = `FAIL`.

### Regla de hermanos estructurales

Cuando se detecta un defecto en una pieza de una familia visual, se revisan todas las piezas que comparten la misma estructura o reglas CSS. No se corrige únicamente la página donde apareció el fallo.

Ejemplo: un overflow en la portada obliga a revisar portada, interludios, cierres y cualquier panel que herede el mismo mecanismo de anchura/posicionamiento.

### Estabilidad de renderer

No combinar `flex` con semántica de tabla o posicionamientos complejos dentro de una pieza crítica sin verificación renderizada. Para estructuras HERO, preferir bloques simples, `inline-block`, tablas reales o posicionamiento explícito cuando el layout sea fijo.

### QA obligatorio de la familia HERO

Antes de cerrar una entrega:

- render ampliado de portada;
- render ampliado de cada interludio dominante;
- render ampliado de cada tesis/cierre dominante;
- comprobación de clipping, overflow, texto estrecho, espacio muerto y equilibrio de masa;
- verificación en un segundo renderer cuando la pieza use posicionamiento o composición sensible.

## 13. Regla de no regresión visual

Una nueva versión no puede recuperar ninguno de estos defectos ya cerrados:

- prosa vertical residual en estructuras repetitivas;
- palabras partidas en columnas de pocos caracteres;
- tarjetas que salen del ancho de página;
- títulos de sección huérfanos;
- lecciones que comienzan accidentalmente al final de una página;
- páginas casi vacías sin función pedagógica explícita;
- auto-hifenación agresiva en tarjetas;
- pérdida de frases de la fuente durante la compactación semántica.

## 14. Resultado esperado

El alumno debe poder distinguir visualmente, antes de leer en detalle, qué está ocurriendo en cada página: **escena, explicación, comparación, proceso, caso, frontera, práctica, laboratorio, checkpoint o interludio**.

Ese reconocimiento inmediato es el criterio visual principal del manual.

## Revisión v1.5 — gramática de portada

La portada se trata como una familia propia y debe ser más simple que las páginas didácticas interiores.

Reglas obligatorias:

- Una sola retícula principal.
- Un solo gesto visual dominante como máximo.
- Prohibido acumular simultáneamente diagonales, círculos, iconos, líneas, badges y metadatos flotantes.
- El título es siempre el primer foco visual; ningún elemento decorativo puede competir con él.
- Subtítulo, volumen y clase deben pertenecer a la misma alineación o a una banda de metadatos claramente separada.
- Autor y clase se resuelven en una zona estable de metadatos; nunca flotan sobre geometrías decorativas.
- La portada puede ser dinámica por escala, contraste, número fantasma o bloque cromático, pero no por acumulación de recursos.
- Debe superar `COVER_SIMPLICITY_GATE`: si se pueden eliminar dos elementos sin perder identidad o información, la portada todavía no está cerrada.
- Cualquier cambio de portada se valida por render y no debe modificar visualmente ninguna página interior.

Patrón recomendado para el Manual del alumno:

`MARCA → VOLUMEN → TÍTULO → SUBTÍTULO → RESPIRACIÓN → BANDA DE METADATOS`

El elemento dinámico es opcional y único. En el prototipo de Clase 00 v0.7 se utiliza un `00` fantasma; se eliminan la diagonal, el círculo y el signo de interrogación de versiones anteriores.
