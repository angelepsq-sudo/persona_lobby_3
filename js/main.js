/* Punto de entrada: arranca los módulos y registra los eventos globales (clics y teclado). */
import { STATE } from './data.js';
import { $ } from './util.js';
import { initUI, actions, setActiveMenu, openSection, closeOrReplay } from './ui.js';
import { initEffects, startDive } from './effects.js';
import { isMuted, setMuted, toggleMute, bindVisibility, warmUpMusic, unlockAudio, playSfx } from './audio.js';

/* Clics: cualquier elemento con data-action="..." ejecuta la acción de ui.js */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const name = el.dataset.action;
  if (Object.hasOwn(actions, name)) actions[name](el);
});

/* Los navegadores solo permiten audio tras una interacción: la primera desbloquea los sonidos */
['pointerdown', 'keydown'].forEach((type) => {
  window.addEventListener(type, unlockAudio, { once: true, capture: true });
});

/* Teclado (flechas, Enter/A, Esc/B/Backspace, R, M) */
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  // Elementos interactivos: Enter/Espacio los activan; no se mezclan con los atajos de juego
  const interactive = e.target.closest?.('button, a, [role="button"]');
  if (interactive && (e.key === 'Enter' || e.key === ' ')) {
    if (interactive.getAttribute('role') === 'button') {
      e.preventDefault();
      interactive.click();
    }
    return;
  }

  if (e.key === 'm' || e.key === 'M') { toggleMute(); return; }
  if (document.body.classList.contains('pre-dive')) return; // aún en la pantalla de inicio

  const key = e.key.toLowerCase();
  if (e.key === 'ArrowDown' && !STATE.modalOpen) {
    e.preventDefault();
    playSfx('hover');
    setActiveMenu(STATE.activeIdx + 1);
  } else if (e.key === 'ArrowUp' && !STATE.modalOpen) {
    e.preventDefault();
    playSfx('hover');
    setActiveMenu(STATE.activeIdx - 1);
  } else if ((e.key === 'Enter' || key === 'a') && !STATE.modalOpen) {
    playSfx('confirm');
    openSection(STATE.activeIdx);
  } else if (e.key === 'Escape' || key === 'b' || e.key === 'Backspace') {
    closeOrReplay();
  } else if (key === 'r') {
    startDive();
  }
});

/* Arranque */
initUI();
initEffects();
bindVisibility();
warmUpMusic();
setMuted(isMuted());
$('diveBtn')?.focus({ preventScroll: true });
