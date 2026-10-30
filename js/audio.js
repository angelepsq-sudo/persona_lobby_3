/* Audio: música de fondo (musica.mp3) + efectos de sonido sintetizados + silenciar. */
import { $, storage } from './util.js';

const MUTE_KEY = 'p3r:muted';

let ctx = null;
let master = null;      // volumen general (mute)
let analyser = null;    // para que el fondo "pulse" con los graves
let freqData = null;
let wired = false;
let muted = storage.get(MUTE_KEY) === '1';
let wantPlaying = false;
let unlocked = false;   // el navegador solo permite audio tras una interacción del usuario

const bgmEl = () => $('bgm');

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

/** Nivel de graves 0..1 (para animar el fondo). */
export function getBass() {
  if (!analyser) return 0;
  analyser.getByteFrequencyData(freqData);
  return (freqData[1] + freqData[2] + freqData[3]) / (3 * 255);
}

/** Descarga el mp3 en segundo plano cuando la página ya cargó (el clic arranca al instante). */
export function warmUpMusic() {
  const el = bgmEl();
  if (!el) return;
  // Solo cambia preload (nunca load(): reiniciaría la reproducción si el usuario ya pulsó play)
  const go = () => { if (!wantPlaying) el.preload = 'auto'; };
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 3000 });
    else setTimeout(go, 1500);
  }, { once: true });
}

export function startBgm() {
  const el = bgmEl();
  if (!el) return;
  el.volume = 0.8;
  wantPlaying = true;

  // Analizador de graves: solo con http(s). Abierto como archivo (file://) el navegador dejaría el audio mudo.
  if (!wired && location.protocol.startsWith('http')) {
    try {
      ensureCtx();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      freqData = new Uint8Array(analyser.frequencyBinCount);
      const src = ctx.createMediaElementSource(el);
      src.connect(analyser);
      analyser.connect(master);
      wired = true;
    } catch { analyser = null; }
  }
  if (!wired) el.muted = muted;

  const p = el.play();
  if (p && p.catch) p.catch(() => { /* el navegador bloqueó el autoplay: se reintenta en el siguiente clic */ });
}

/** Se llama en el primer clic/tecla: a partir de ahí ya se pueden reproducir sonidos. */
export function unlockAudio() { unlocked = true; }

export function isMuted() { return muted; }

export function setMuted(value) {
  muted = value;
  storage.set(MUTE_KEY, value ? '1' : '0');
  if (master) master.gain.value = value ? 0 : 1;
  const el = bgmEl();
  if (el && !wired) el.muted = value;
  const btn = $('soundBtn');
  if (btn) {
    btn.setAttribute('aria-pressed', String(value));
    btn.setAttribute('aria-label', value ? 'Activar música y sonidos' : 'Silenciar música y sonidos');
    btn.title = value ? 'Activar sonido (M)' : 'Silenciar (M)';
  }
}

export function toggleMute() { setMuted(!muted); }

/** Pausa la música si cambias de pestaña y la reanuda al volver. */
export function bindVisibility() {
  document.addEventListener('visibilitychange', () => {
    const el = bgmEl();
    if (!el || !wantPlaying) return;
    if (document.hidden) el.pause();
    else el.play().catch(() => {});
  });
}

const SFX = {
  hover:   { type: 'triangle', f0: 740, f1: 1380, ramp: 0.04, vol: 0.06, dur: 0.045 },
  confirm: { type: 'sawtooth', f0: 540, jump: [1080, 0.045], vol: 0.08, dur: 0.14 },
  back:    { type: 'sine', f0: 680, f1: 280, ramp: 0.09, vol: 0.08, dur: 0.10 },
  splash:  { type: 'sine', f0: 240, f1: 36, ramp: 0.52, vol: 0.26, dur: 0.54 }
};

export function playSfx(name) {
  const p = SFX[name];
  if (!p || muted || !unlocked) return;
  try {
    ensureCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.f0, t);
    if (p.f1) osc.frequency.exponentialRampToValueAtTime(p.f1, t + p.ramp);
    if (p.jump) osc.frequency.setValueAtTime(p.jump[0], t + p.jump[1]);
    gain.gain.setValueAtTime(p.vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + p.dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + p.dur + 0.01);
  } catch { /* sin audio disponible */ }
}
