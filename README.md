# Museo del Surubí, sala virtual (A-Frame)

## Cómo abrirlo
- **Doble clic en `index.html`**: funciona, porque todo se carga con etiquetas `<script>` comunes.
- Para que anden bien los videos de YouTube conviene un servidor: dentro de esta carpeta, `python3 -m http.server` y abrir `localhost:8000`.
- Para generar los HTML únicos de entrega: `python3 construir.py` (salen en `dist/`).

## Qué hay en cada archivo (orden de carga)
| Archivo | Qué contiene |
|---|---|
| `js/00-config.js` | `MUSEO`: medidas, límites de colisión, colores, parámetros de audio |
| `js/01-nucleo.js` | utilidades (`E`, `R`, `lienzo`, `viva`, `rotulo`...), componente `mover`. Va en el `<head>` |
| `datos/piezas.js` | `PIEZAS`: la lista de obras, en orden de recorrido |
| `datos/imagenes.js` | imágenes y logo en base64 |
| `datos/audio.js` | sonidos en base64 |
| `js/02-arquitectura.js` | piso, muros, puerta, ventana, techo, luces, balcón, fachada |
| `js/03-contenido.js` | cuadros, íconos, bloque central, rótulos, línea de tiempo, obras (`lista`) |
| `js/04-exterior.js` | atardecer, agua, isla, canoa, peces 3D |
| `js/05-interaccion.js` | cartela, visor, clic en obras, audio por proximidad |

## Contratos entre bloques (no cambiar sin avisar)
- **IDs del DOM**: `cam, sala, ayuda, entrar, cartela, c-titulo, c-autor, c-texto, c-hint, avanzar, sonido, visor, v-cerrar, v-tabs, t-img, t-vid, v-medio, v-titulo, v-autor, v-texto, v-vt, v-yt`.
- **Globales que cruzan bloques**: `MUSEO`, `PIEZAS`, `IMG`, `lista` (una entrada por pieza: `{o, x, z, lienzo, cv}`), `cuadroV`, `pintarV`, `ampliada`, `rehacer`, `window.__avanzar`.
- **Orden**: un `const` solo existe después de la línea que lo declara, así que respetar el orden de la tabla.

## Estado de la refactorización
Paso 1 hecho: división en carpeta, `MUSEO` y núcleo. El código de los bloques 02 a 05 es el original sin cambios de lógica. Las medidas del edificio todavía están escritas a mano en 02; se pasan a `MUSEO` cuando se trabaje ese bloque.
