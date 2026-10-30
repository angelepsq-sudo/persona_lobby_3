/* Utilidades pequeñas: plantillas HTML seguras y ayudantes del DOM. */

class SafeHtml {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (v) => String(v).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Marca un string como HTML de confianza (solo para constantes propias, p. ej. los iconos SVG). */
export const raw = (value) => new SafeHtml(value);

const render = (v) => {
  if (v instanceof SafeHtml) return v.value;
  if (Array.isArray(v)) return v.map(render).join('');
  if (v === null || v === undefined || v === false) return '';
  return escapeHtml(v);
};

/** Plantilla etiquetada: html`<p>${texto}</p>` escapa todo lo interpolado automáticamente (anti-XSS). */
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => { out += render(v) + strings[i + 1]; });
  return new SafeHtml(out);
}

export const $ = (id) => document.getElementById(id);

/** Escribe una plantilla html`` dentro de un elemento. */
export function mount(el, template) {
  el.innerHTML = template.toString();
  applyDynamicStyles(el);
}

/** Aplica anchos dinámicos (data-w="62") por CSSOM, así no hace falta style="" en línea (CSP estricta). */
export function applyDynamicStyles(root) {
  root.querySelectorAll('[data-w]').forEach((el) => {
    el.style.width = `${Number(el.dataset.w) || 0}%`;
  });
}

export const formatYen = (n) => n.toLocaleString('en-US');

/** Guardado seguro en localStorage (puede fallar en modo privado). */
export const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* ignorar */ } }
};
