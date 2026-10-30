/** Tailwind se compila una sola vez a css/tailwind.css (sin CDN en producción).
 *  Escanea el HTML y los módulos JS para encontrar las clases usadas. */
module.exports = {
  content: ['../index.html', '../js/**/*.js'],
  theme: {
    extend: {
      // z-35 y z-90 se usaban en el diseño original pero no existen en Tailwind por defecto
      zIndex: { 35: '35', 90: '90' }
    }
  },
  plugins: []
};
