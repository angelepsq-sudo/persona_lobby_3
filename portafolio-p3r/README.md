# Portafolio // Persona 3 Reload

Sitio estático (HTML + CSS + JavaScript) con menú interactivo estilo Persona 3 Reload. Sin frameworks ni dependencias en producción: se sube a Vercel tal cual.

## Estructura

```
├── index.html            Página única
├── css/
│   ├── tailwind.css      Utilidades de Tailwind ya compiladas (minificado)
│   ├── fonts.css         Fuentes propias (@font-face)
│   └── styles.css        Estilos del diseño P3R, temas y animaciones
├── js/
│   ├── main.js           Arranque, clics y teclado
│   ├── data.js           Iconos SVG y datos/estado inicial
│   ├── ui.js             Menú, HUD, las 9 secciones y sus acciones
│   ├── effects.js        Fondo submarino, chapuzón, burbujas
│   ├── audio.js          Música, efectos de sonido y silenciar
│   └── util.js           Plantillas HTML seguras y utilidades
├── assets/
│   ├── img/              persona.webp (principal) y persona.png (respaldo), favicon.svg
│   ├── audio/musica.mp3  Música de fondo (128 kbps)
│   └── fonts/            Inter, Archivo Black, Space Grotesk (woff2)
├── vercel.json           Headers de seguridad y caché
├── .vercelignore         Lo que NO se despliega (tools/, README)
├── robots.txt
└── tools/                Solo para desarrollo (recompilar Tailwind)
```

## Probar en local

Los módulos de JavaScript necesitan un servidor (no funcionan con doble clic en `index.html`). Elige uno:

```bash
python3 -m http.server 8080      # luego abre http://localhost:8080
# o
npx serve .
```

También sirve la extensión **Live Server** de VS Code.

## Subir a Vercel

1. Sube **toda la carpeta** a un repositorio de GitHub (raíz = donde está `index.html`).
2. En vercel.com: *Add New → Project* → elige el repo → **Deploy**.
   No necesitas Build Command ni Output Directory: es un sitio estático.

Desde la terminal: `npx vercel --prod`.

## Cómo cambiar cosas

| Quiero cambiar…        | Edita…                                                       |
| ---------------------- | ------------------------------------------------------------ |
| Textos del menú y datos| `js/data.js` (`STATE.menus`, `skills`, `quests`, …)          |
| Contenido de secciones | `js/ui.js` (funciones `skillSection`, `itemSection`, …)      |
| Colores / diseño       | `css/styles.css` (variables en `:root` y los temas)          |
| Retrato                | Reemplaza `assets/img/persona.webp` y `persona.png`          |
| Música                 | Reemplaza `assets/audio/musica.mp3` (conserva el nombre)     |
| Título / descripción   | `<head>` de `index.html`                                     |

Si añades **clases de Tailwind nuevas** en `index.html` o `js/*.js`, recompila el CSS:

```bash
cd tools
npm install
npm run build:css
```

## Atajos de teclado

↑ ↓ moverse · Enter / A abrir · Esc / B / Backspace cerrar · R repetir chapuzón · M silenciar

## Seguridad (ya configurada en `vercel.json`)

- **Content-Security-Policy estricta**: solo scripts, estilos, fuentes, imágenes y audio del propio dominio; sin `unsafe-inline` ni `unsafe-eval`; sin iframes ni formularios.
- HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP y CORP.
- Sin CDNs ni Google Fonts: nada se carga de terceros (más rápido y privado).
- Sin `onclick` en línea; las plantillas escapan el HTML automáticamente (`js/util.js`).
- Si más adelante agregas analítica, un formulario o un servicio externo, **amplía la CSP** (`connect-src`, `script-src`…) o el navegador lo bloqueará.

## Rendimiento

Tailwind compilado (~15 KB, sin CDN), fuentes locales con `font-display: swap`, retrato en WebP (~180 KB en vez de ~1 MB), música a 128 kbps (~2.7 MB, se precarga en segundo plano), caché larga para fuentes y assets.
