/* Efectos visuales: fondo submarino del Tártaro (canvas) y chapuzón (burbujas, esquirlas, ondas). */
import { $ } from './util.js';
import { playSfx, startBgm, getBass } from './audio.js';

const bgCanvas = $('tartarusCanvas');
const spCanvas = $('splashCanvas');
const bgCtx = bgCanvas.getContext('2d');
const spCtx = spCanvas.getContext('2d');
const protagWrap = $('protagWrap');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let bubbles = [];
let shards = [];
let shockwaves = [];
let mouseX = 0;
let skyGradient = null;

/* ---------- Tamaño del canvas ---------- */
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  bgCanvas.width = spCanvas.width = w;
  bgCanvas.height = spCanvas.height = h;

  // El degradado solo cambia con el tamaño: se crea una vez y se reutiliza en cada frame.
  skyGradient = bgCtx.createLinearGradient(0, 0, 0, h);
  skyGradient.addColorStop(0, '#3cf8ff');
  skyGradient.addColorStop(0.18, '#00b8ff');
  skyGradient.addColorStop(0.52, '#0047cc');
  skyGradient.addColorStop(1, '#02104a');
}

/* ---------- Chapuzón (intro) ---------- */
export function startDive() {
  $('diveGate').classList.add('hidden-gate');

  playSfx('splash');
  startBgm();

  const body = document.body;
  body.classList.remove('pre-dive', 'diving-impact', 'plunge-active');
  void body.offsetWidth; // reinicia las animaciones CSS
  body.classList.add('diving-impact', 'plunge-active');
  document.dispatchEvent(new CustomEvent('p3r:dive')); // la UI libera el escenario (inert)

  const w = window.innerWidth;
  const h = window.innerHeight;
  const bubbleCount = reducedMotion.matches ? 40 : 185;

  bubbles = Array.from({ length: bubbleCount }, () => ({
    x: Math.random() * w,
    y: h * 0.12 + Math.random() * h * 0.88,
    r: 2 + Math.random() * 15,
    vy: -(3.8 + Math.random() * 10.2),
    vx: (Math.random() - 0.5) * 2.4,
    alpha: 0.58 + Math.random() * 0.42
  }));

  shards = Array.from({ length: 28 }, (_, i) => {
    const ang = (Math.PI * 2 * i) / 28;
    const spd = 7 + Math.random() * 16;
    return {
      x: w * 0.3,
      y: h * 0.45,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 3,
      size: 8 + Math.random() * 16,
      color: i % 3 === 0 ? '#ff1f8f' : (i % 2 === 0 ? '#00f0ff' : '#ffffff'),
      alpha: 1
    };
  });

  shockwaves = [
    { x: w * 0.3, y: h * 0.46, r: 15, alpha: 0.95 },
    { x: w * 0.46, y: h * 0.44, r: 5, alpha: 0.78 }
  ];

  setTimeout(() => body.classList.remove('diving-impact'), 820);
}

/* ---------- Dibujo por frame ---------- */
function drawBackground(w, h, sec, bass) {
  bgCtx.fillStyle = skyGradient;
  bgCtx.fillRect(0, 0, w, h);

  // Ondas de luz en la superficie (arriba a la derecha)
  bgCtx.fillStyle = `rgba(195, 253, 255, ${0.54 + bass * 0.26})`;
  for (let i = 0; i < 18; i++) {
    const rx = w * 0.38 + ((i * 97) % (w * 0.6));
    const ry = 18 + (i % 5) * 24 + Math.sin(sec * 2.2 + i) * 5;
    const rw = 55 + (i % 4) * 38 + bass * 36;
    const rh = 6 + (i % 3) * 3.5;
    bgCtx.beginPath();
    bgCtx.ellipse(rx, ry, rw, rh, 0, 0, Math.PI * 2);
    bgCtx.fill();
  }

  // Pilares sumergidos
  bgCtx.fillStyle = 'rgba(2, 22, 95, 0.34)';
  bgCtx.fillRect(w * 0.76, h * 0.14, 38, h * 0.72);
  bgCtx.fillRect(w * 0.88, h * 0.22, 26, h * 0.64);

  // Escalera del Tártaro en perspectiva
  const vx = w * 0.54 + mouseX * 14;
  const vy = h * 0.04;
  const totalSteps = 32;
  for (let s = 0; s < totalSteps; s++) {
    const p = ((s / totalSteps) + sec * 0.028) % 1;
    const ep = p * p;
    const y = vy + ep * (h - vy);
    const halfW = 38 + ep * (w * 0.23);
    const stepH = Math.max(2, ep * 14);
    bgCtx.fillStyle = s % 2 === 0
      ? `rgba(0, 210, 255, ${0.15 + ep * 0.25 + bass * 0.14})`
      : `rgba(2, 14, 78, ${0.48 + ep * 0.36})`;
    bgCtx.fillRect(vx - halfW, y, halfW * 2, stepH);
  }
}

function drawSplash(w, h, sec) {
  // Si no hay nada que dibujar, evita trabajo (y limpia solo una vez).
  if (!shockwaves.length && !shards.length && !bubbles.length) {
    if (drawSplash.dirty) { spCtx.clearRect(0, 0, w, h); drawSplash.dirty = false; }
    return;
  }
  drawSplash.dirty = true;
  spCtx.clearRect(0, 0, w, h);

  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i];
    sw.r += 24;
    sw.alpha *= 0.93;
    spCtx.strokeStyle = `rgba(255, 255, 255, ${sw.alpha})`;
    spCtx.lineWidth = 4;
    spCtx.beginPath();
    spCtx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
    spCtx.stroke();
    if (sw.alpha < 0.03) shockwaves.splice(i, 1);
  }

  for (let i = shards.length - 1; i >= 0; i--) {
    const sh = shards[i];
    sh.x += sh.vx;
    sh.y += sh.vy;
    sh.vy += 0.32;
    sh.alpha *= 0.95;
    spCtx.fillStyle = sh.color;
    spCtx.globalAlpha = sh.alpha;
    spCtx.beginPath();
    spCtx.moveTo(sh.x, sh.y - sh.size);
    spCtx.lineTo(sh.x + sh.size * 0.8, sh.y);
    spCtx.lineTo(sh.x, sh.y + sh.size);
    spCtx.lineTo(sh.x - sh.size * 0.8, sh.y);
    spCtx.closePath();
    spCtx.fill();
    spCtx.globalAlpha = 1;
    if (sh.alpha < 0.04) shards.splice(i, 1);
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.y += b.vy;
    b.x += b.vx + Math.sin(sec * 3 + i) * 0.5;
    b.alpha *= 0.988;
    spCtx.strokeStyle = `rgba(210, 253, 255, ${b.alpha})`;
    spCtx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.25})`;
    spCtx.lineWidth = 1.8;
    spCtx.beginPath();
    spCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    spCtx.fill();
    spCtx.stroke();
    if (b.y < -25 || b.alpha < 0.03) bubbles.splice(i, 1);
  }
}

function frame(time) {
  const w = bgCanvas.width;
  const h = bgCanvas.height;
  const sec = time * 0.001;

  drawBackground(w, h, sec, getBass());
  drawSplash(w, h, sec);

  requestAnimationFrame(frame);
}

export function initEffects() {
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  }, { passive: true });

  // Al terminar la caída del personaje, vuelve a flotar suavemente (antes se quedaba quieto para siempre).
  protagWrap.addEventListener('animationend', (e) => {
    if (e.animationName === 'plungeChar') document.body.classList.remove('plunge-active');
  });
  requestAnimationFrame(frame);
}

