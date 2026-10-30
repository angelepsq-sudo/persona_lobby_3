# Portafolio // Persona 3 Reload

Sitio estático (HTML + CSS + JavaScript) con un menú interactivo inspirado en Persona 3 Reload. Sin frameworks ni dependencias.

## Estructura del proyecto

```
├── index.html            Página única
├── css/
│   ├── tailwind.css      Utilidades de Tailwind ya compiladas
│   ├── fonts.css         Fuentes propias (@font-face)
│   └── styles.css        Estilos del diseño, temas, animaciones y ajustes para celular
├── js/
│   ├── main.js           Arranque, clics y teclado
│   ├── data.js           Iconos SVG y datos / estado inicial
│   ├── ui.js             Menú, HUD y las 9 secciones
│   ├── effects.js        Fondo submarino, chapuzón y burbujas
│   ├── audio.js          Música, efectos de sonido y silenciar
│   └── util.js           Plantillas HTML seguras y utilidades
├── assets/
│   ├── img/              Retrato (webp y png) y favicon
│   ├── audio/musica.mp3  Música de fondo
│   └── fonts/            Inter, Archivo Black, Space Grotesk (woff2)
├── vercel.json           Cabeceras de seguridad y caché
├── .vercelignore         Archivos que no se despliegan
├── robots.txt
└── tools/                Solo para desarrollo (recompilar Tailwind)
```

## Personalizar

| Quiero cambiar…         | Edita…                                              |
| ----------------------- | --------------------------------------------------- |
| Textos del menú y datos | `js/data.js`                                        |
| Contenido de secciones  | `js/ui.js`                                          |
| Colores y diseño        | `css/styles.css` (variables en `:root`)             |
| Retrato                 | `assets/img/persona.webp` y `persona.png`           |
| Música                  | `assets/audio/musica.mp3` (conserva el nombre)      |
| Título y descripción    | `<head>` de `index.html`                            |

Si añades clases nuevas de Tailwind, recompila el CSS:

```bash
cd tools
npm install
npm run build:css
```

## Atajos de teclado

↑ ↓ moverse · Enter / A abrir · Esc / B / Backspace cerrar · R repetir chapuzón · M silenciar

## Créditos

Proyecto de fans, sin fines de lucro y sin relación oficial con las marcas mencionadas.

- **Persona 3 Reload** y su estilo visual, personajes e ilustraciones: © ATLUS / SEGA. Todos los derechos pertenecen a sus dueños.
- **Música:** "It's Going Down Now", de la saga Persona 3 (ATLUS / SEGA), compuesta por Shoji Meguro.
- **Fuentes:** Inter, Archivo Black y Space Grotesk, con licencia SIL Open Font License.
- **Código y maquetación:** hechos para este portafolio.
