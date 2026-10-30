/* Interfaz: menú principal, HUD, modal con las 9 secciones y todas las acciones (clics). */
import { ICONS, STATE } from './data.js';
import { $, html, raw, mount, formatYen } from './util.js';
import { playSfx, toggleMute } from './audio.js';
import { startDive } from './effects.js';

const THEMES = ['p3', 'p5', 'p4'];
const PERSONAS = [
  { name: 'Orpheus', arcana: '0. The Fool', lv: 1 },
  { name: 'Thanatos', arcana: 'XIII. Death', lv: 78 },
  { name: 'Izanagi', arcana: '0. The Fool', lv: 45 },
  { name: 'Messiah', arcana: 'XX. Judgement', lv: 91 }
];
const PORTRAIT_HAIR = ['#0047cc', '#ff70a6', '#1e293b'];

const icon = (key) => raw(ICONS[key] ?? '');
const firstName = (ally) => ally.name.split(' ')[0];

let lastFocus = null;

/* =========================================================================
   Menú principal, footer de comandos y HUD
   ========================================================================= */
export function renderMenu() {
  mount($('menuStack'), html`${STATE.menus.map((m, idx) => html`
    <div class="menu-item ${idx === STATE.activeIdx ? 'active' : ''}" data-idx="${idx}" data-action="open-section" data-i="${idx}"
         role="button" tabindex="0" aria-label="${m.name}: ${m.cmd}">
      <div class="shard-pink"></div>
      <div class="shard-white"></div>
      <div class="menu-svg-badge">${icon(m.icon)}</div>
      <span class="menu-text">${m.name}</span>
    </div>`)}`);
  updateCommandFooter();
}

export function setActiveMenu(idx) {
  STATE.activeIdx = (idx + STATE.menus.length) % STATE.menus.length;
  document.querySelectorAll('.menu-item').forEach((el, i) => {
    el.classList.toggle('active', i === STATE.activeIdx);
  });
  updateCommandFooter();
}

function updateCommandFooter() {
  const m = STATE.menus[STATE.activeIdx];
  $('cmdLabel').textContent = m.cmd;
  mount($('cmdIconBox'), icon(m.icon));
}

export function renderControllerIcons() {
  mount($('hudBtnAIcon'), icon('btn_a'));
  mount($('hudBtnBIcon'), icon('btn_b'));
  mount($('modalCloseBtnIcon'), icon('btn_b'));
}

export function renderPartyHud() {
  mount($('partyHud'), html`${STATE.party.map((ally, i) => html`
    <div class="party-slot flex flex-col items-center ${i === STATE.selectedAlly ? 'selected-ally' : ''}"
         data-action="select-ally" data-i="${i}" role="button" tabindex="0"
         aria-pressed="${i === STATE.selectedAlly}"
         aria-label="${ally.name}, HP ${ally.hp} de ${ally.maxHp}, SP ${ally.sp} de ${ally.maxSp}"
         title="${ally.name} (HP ${ally.hp}/${ally.maxHp} | SP ${ally.sp}/${ally.maxSp})">
      <div class="portrait-oct">
        <svg viewBox="0 0 44 44" class="w-10 h-10" aria-hidden="true">
          <circle cx="22" cy="22" r="19" fill="#29ecff" />
          <path d="M12,17 C14,8 30,8 33,17 L31,29 L12,29 Z" fill="${PORTRAIT_HAIR[i]}" />
          <circle cx="21" cy="21" r="6.5" fill="#ffffff" />
          <path d="M11,38 C14,31 30,31 33,38 Z" fill="#051650" />
        </svg>
      </div>
      <div class="party-bars">
        <div class="w-full h-1.5 bg-slate-950 overflow-hidden">
          <div class="h-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-300" data-w="${Math.round((ally.hp / ally.maxHp) * 100)}"></div>
        </div>
        <div class="w-full h-1.5 bg-slate-950 overflow-hidden mt-1">
          <div class="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300" data-w="${Math.round((ally.sp / ally.maxSp) * 100)}"></div>
        </div>
      </div>
    </div>`)}`);
}

export function syncHud() {
  $('hudWallet').textContent = formatYen(STATE.wallet);
  $('modalWallet').textContent = `¥ ${formatYen(STATE.wallet)}`;
  $('hudDay').textContent = STATE.day;
  $('hudMonth').textContent = STATE.month;
  $('modalDate').textContent = `${STATE.day} ${STATE.month} 2009`;
}

function animateWallet(target) {
  const start = STATE.wallet;
  const t0 = performance.now();
  STATE.wallet = target;
  const step = (now) => {
    const t = Math.min(1, (now - t0) / 420);
    const cur = Math.round(start + (target - start) * t);
    $('hudWallet').textContent = formatYen(cur);
    $('modalWallet').textContent = `¥ ${formatYen(cur)}`;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function showToast(msg) {
  const t = $('toastMsg');
  t.textContent = msg;
  t.classList.remove('opacity-0', 'translate-y-8');
  t.classList.add('opacity-100', 'translate-y-0');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    t.classList.add('opacity-0', 'translate-y-8');
    t.classList.remove('opacity-100', 'translate-y-0');
  }, 2200);
}

/* =========================================================================
   Modal (abrir / cerrar) y accesibilidad (foco, inert)
   ========================================================================= */
export function syncInert() {
  const blocked = document.body.classList.contains('pre-dive') || STATE.modalOpen;
  $('mainStage').inert = blocked;
}

export function openSection(idx) {
  lastFocus = document.activeElement;
  setActiveMenu(idx);
  STATE.modalOpen = true;

  const m = STATE.menus[idx];
  $('modalTag').textContent = m.name;
  $('modalSubtitle').textContent = m.sub;
  mount($('modalIconBadge'), icon(m.icon));

  const modal = $('subWebModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.inert = false;
  syncInert();

  renderSection(idx);
  syncHud();
  $('modalCloseBtn').focus({ preventScroll: true });
}

export function closeSection() {
  playSfx('back');
  STATE.modalOpen = false;
  const modal = $('subWebModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modal.inert = true;
  syncInert();
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

export function closeOrReplay() {
  if (STATE.modalOpen) closeSection();
  else startDive();
}

/* =========================================================================
   Las 9 secciones (cada una devuelve una plantilla html``)
   ========================================================================= */
const currentAlly = () => STATE.party[STATE.selectedAlly];

function skillSection() {
  const ally = currentAlly();
  return html`
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${STATE.skills.map((s, i) => html`
        <div class="p3-card p-4 flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7">${icon(s.icon)}</span>
                <span class="font-['Archivo_Black'] text-xl">${s.name}</span>
              </div>
              <span class="bg-pink-600 text-white text-xs font-mono font-bold px-2 py-0.5">${s.sp} SP</span>
            </div>
            <p class="text-xs text-cyan-100 mt-2">${s.desc}</p>
          </div>
          <button type="button" class="p3-btn text-xs self-start" data-action="cast-skill" data-i="${i}">
            LANZAR CON ${firstName(ally)}
          </button>
        </div>`)}
    </div>`;
}

function itemSection() {
  const ally = currentAlly();
  const inventory = STATE.itemTab === 'inventory';
  return html`
    <div class="flex gap-3 mb-4">
      <button type="button" class="p3-btn text-xs ${inventory ? '!bg-cyan-400' : 'opacity-70'}" data-action="item-tab" data-val="inventory">
        🎒 MOCHILA S.E.E.S.
      </button>
      <button type="button" class="p3-btn text-xs ${!inventory ? '!bg-pink-500 !text-white' : 'opacity-70'}" data-action="item-tab" data-val="shop">
        🏪 FARMACIA AOHIGE (COMPRAR CON ¥${formatYen(STATE.wallet)})
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      ${STATE.items.map((it, i) => html`
        <div class="p3-card p-4 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between">
              <span class="font-['Archivo_Black'] text-lg">${it.name}</span>
              <span class="text-yellow-300 font-mono text-sm">¥${it.price}</span>
            </div>
            <div class="text-xs font-mono text-cyan-300 mt-1">EN MOCHILA: x${it.qty}</div>
            <p class="text-xs text-cyan-100 mt-2">${it.desc}</p>
          </div>
          ${inventory
            ? html`<button type="button" class="p3-btn text-xs w-full" data-action="use-item" data-i="${i}">USAR EN ${firstName(ally)}</button>`
            : html`<button type="button" class="p3-btn text-xs w-full !bg-emerald-400" data-action="buy-item" data-i="${i}">COMPRAR (-¥${it.price})</button>`}
        </div>`)}
    </div>`;
}

function equipSection() {
  const ally = currentAlly();
  return html`
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="p3-card p-5">
        <div class="text-xs font-mono text-cyan-300">MIEMBRO ACTIVO (CLIC ARRIBA A LA DERECHA PARA CAMBIAR)</div>
        <h3 class="font-['Archivo_Black'] text-2xl mt-1">${ally.name}</h3>
        <div class="mt-4 space-y-4 text-sm">
          <div>
            <div class="flex justify-between mb-1">
              <span>ARMA: <strong class="text-cyan-300">${ally.weapon}</strong></span>
              <span class="font-mono">ATK ${ally.atk}</span>
            </div>
            <div class="w-full h-2 bg-slate-950"><div class="h-full bg-cyan-400 transition-all duration-300" data-w="${Math.min(100, ally.atk)}"></div></div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span>ARMADURA: <strong class="text-cyan-300">${ally.armor}</strong></span>
              <span class="font-mono">DEF ${ally.def}</span>
            </div>
            <div class="w-full h-2 bg-slate-950"><div class="h-full bg-pink-500 transition-all duration-300" data-w="${Math.min(100, ally.def)}"></div></div>
          </div>
        </div>
      </div>
      <div class="space-y-3">
        ${STATE.armory.map((eq, i) => html`
          <div class="p3-card p-4 flex items-center justify-between gap-4">
            <div>
              <div class="font-['Archivo_Black'] text-lg">${eq.name}</div>
              <p class="text-xs text-cyan-200">${eq.desc}</p>
            </div>
            <button type="button" class="p3-btn text-xs" data-action="equip" data-i="${i}">EQUIPAR</button>
          </div>`)}
      </div>
    </div>`;
}

function personaSection() {
  return html`
    <div class="p3-card p-5 mb-5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12">${icon('butterfly')}</div>
        <div>
          <div class="text-xs font-mono text-cyan-300">PERSONA ACTIVA EN CORAZÓN</div>
          <div class="font-['Archivo_Black'] text-3xl italic text-white">${STATE.equippedPersona}</div>
        </div>
      </div>
      <button type="button" class="p3-btn !bg-pink-500 !text-white" data-action="fuse">
        FUSIÓN DÍADA: ORPHEUS + THANATOS → MESSIAH
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${PERSONAS.map((p) => html`
        <div class="p3-card p-4 flex flex-col justify-between gap-3">
          <div>
            <span class="text-xs font-mono text-pink-400">${p.arcana} // LV.${p.lv}</span>
            <div class="font-['Archivo_Black'] text-xl mt-1">${p.name}</div>
          </div>
          <button type="button" class="p3-btn text-xs self-start" data-action="set-persona" data-val="${p.name}">INVOCAR</button>
        </div>`)}
    </div>`;
}

function statsSection() {
  return html`
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      <div class="p3-card p-4 flex flex-col items-center justify-center">
        <canvas id="radarCanvas" width="340" height="290" role="img" aria-label="Gráfico pentagonal de parámetros sociales"></canvas>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${Object.keys(STATE.stats).map((key) => html`
          <div class="p3-card p-3.5 flex flex-col justify-between gap-2">
            <div class="flex justify-between font-bold text-sm">
              <span class="text-cyan-300 uppercase">${key}</span>
              <span>${STATE.stats[key]}/100</span>
            </div>
            <div class="w-full h-2 bg-slate-950">
              <div class="h-full bg-cyan-400" data-w="${STATE.stats[key]}"></div>
            </div>
            <button type="button" class="p3-btn text-xs self-start mt-1" data-action="train" data-key="${key}">ENTRENAR (+6)</button>
          </div>`)}
      </div>
    </div>`;
}

function questSection() {
  return html`
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${STATE.quests.map((q, i) => html`
        <div class="p3-card p-4 flex items-center justify-between gap-4">
          <div>
            <div class="font-['Archivo_Black'] text-lg">${q.title}</div>
            <div class="text-yellow-300 font-mono text-sm mt-1">RECOMPENSA: +¥${formatYen(q.reward)}</div>
          </div>
          <button type="button" class="p3-btn text-xs" ${q.done ? raw('disabled') : ''} data-action="complete-quest" data-i="${i}">
            ${q.done ? 'COMPLETADA ✓' : 'RECLAMAR YENES'}
          </button>
        </div>`)}
    </div>`;
}

function socialSection() {
  return html`
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${STATE.links.map((l, i) => html`
        <div class="p3-card p-4 flex items-center justify-between gap-4">
          <div>
            <div class="text-xs font-mono text-pink-400 font-bold">${l.arcana}</div>
            <div class="font-['Archivo_Black'] text-xl">${l.person}</div>
            <div class="text-yellow-300 tracking-widest text-sm mt-1" aria-label="Rango ${l.rank} de 10">${'★'.repeat(l.rank)}${'☆'.repeat(10 - l.rank)}</div>
          </div>
          <button type="button" class="p3-btn text-xs" data-action="bond-up" data-i="${i}">PASAR TIEMPO ★</button>
        </div>`)}
    </div>`;
}

function calendarSection() {
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  return html`
    <div class="p3-card p-5">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <strong class="font-['Archivo_Black'] text-xl">MAYO 2009 // HAZ CLIC EN UN DÍA PARA CAMBIAR EL "01 MAY" DEL MENÚ</strong>
        <span class="text-xs font-mono text-yellow-300">🌕 09 MAY = FULL MOON OPERATION</span>
      </div>
      <div class="grid grid-cols-7 gap-2">
        ${days.map((d) => html`
          <button type="button" class="p-2.5 font-mono font-black text-sm border ${STATE.day === d ? 'bg-pink-500 text-white border-white' : 'bg-slate-950/70 text-cyan-200 border-cyan-400/30 hover:border-white'}"
                  data-action="set-day" data-val="${d}">
            ${d} ${d === '09' ? '🌕' : ''}
          </button>`)}
      </div>
    </div>`;
}

function systemSection() {
  return html`
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
      <div class="p3-card p-4">
        <div class="text-xs font-mono text-cyan-300 mb-2">1. CAMBIAR TEMA DE COLOR</div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="p3-btn text-xs !bg-cyan-400" data-action="set-theme" data-val="p3">P3R CIAN</button>
          <button type="button" class="p3-btn text-xs !bg-red-600 !text-white" data-action="set-theme" data-val="p5">P5R ROJO</button>
          <button type="button" class="p3-btn text-xs !bg-yellow-300" data-action="set-theme" data-val="p4">P4G DORADO</button>
        </div>
      </div>
      <div class="p3-card p-4">
        <div class="text-xs font-mono text-cyan-300 mb-2">2. CHAPUZÓN</div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="p3-btn text-xs !bg-pink-500 !text-white" data-action="repeat-dive">🌊 REPETIR CHAPUZÓN</button>
        </div>
      </div>
      <div class="p3-card p-4">
        <div class="text-xs font-mono text-cyan-300 mb-2">3. PACK COMPLETO (22 ICONOS SVG)</div>
        <button type="button" class="p3-btn text-xs w-full" data-action="dl-all">⬇️ DESCARGAR PACK COMPLETO (22 ICONOS .SVG)</button>
      </div>
    </div>

    <div class="p3-card p-4">
      <div class="text-xs font-mono text-cyan-300 mb-3">HAZ CLIC EN CUALQUIER ICONO (INCLUYENDO LOS BOTONES A Y B) PARA DESCARGAR SU ARCHIVO .SVG:</div>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2.5">
        ${Object.keys(ICONS).map((k) => html`
          <button type="button" data-action="dl-icon" data-key="${k}"
                  class="bg-slate-950/85 border border-cyan-400/50 hover:border-white p-2 flex flex-col items-center gap-1 transition transform hover:-translate-y-1"
                  title="Descargar p3r-icon-${k}.svg">
            <div class="w-8 h-8">${icon(k)}</div>
            <span class="text-[10px] font-mono uppercase text-cyan-200">${k}</span>
          </button>`)}
      </div>
    </div>`;
}

const SECTIONS = [skillSection, itemSection, equipSection, personaSection, statsSection, questSection, socialSection, calendarSection, systemSection];

function renderSection(idx = STATE.activeIdx) {
  mount($('modalContent'), SECTIONS[idx]());
  if (idx === 4) requestAnimationFrame(drawStatsRadar);
}

/* =========================================================================
   Gráfico radar (STATS)
   ========================================================================= */
function drawStatsRadar() {
  const c = $('radarCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const cx = c.width / 2;
  const cy = c.height / 2;
  const r = 98;
  const keys = Object.keys(STATE.stats);
  const angle = (i) => (Math.PI * 2 * i) / keys.length - Math.PI / 2;
  ctx.clearRect(0, 0, c.width, c.height);

  [0.35, 0.7, 1].forEach((scale) => {
    ctx.beginPath();
    keys.forEach((_, i) => {
      const x = cx + Math.cos(angle(i)) * r * scale;
      const y = cy + Math.sin(angle(i)) * r * scale;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.stroke();
  });

  ctx.beginPath();
  keys.forEach((k, i) => {
    const val = STATE.stats[k] / 100;
    const x = cx + Math.cos(angle(i)) * r * val;
    const y = cy + Math.sin(angle(i)) * r * val;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 31, 143, 0.55)';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  keys.forEach((k, i) => {
    ctx.fillText(k.toUpperCase(), cx + Math.cos(angle(i)) * (r + 26), cy + Math.sin(angle(i)) * (r + 26));
  });
}

/* =========================================================================
   Descarga de iconos SVG
   ========================================================================= */
function downloadSvg(filename, content) {
  const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* =========================================================================
   Acciones: cada botón declara data-action="nombre" y se resuelve aquí
   (sin onclick en línea → compatible con una CSP estricta)
   ========================================================================= */
const idxOf = (el) => Number(el.dataset.i);

export const actions = {
  'start-dive': () => startDive(),
  'repeat-dive': () => { closeSection(); startDive(); },
  'close': () => closeSection(),
  'close-or-replay': () => closeOrReplay(),
  'confirm': () => openSection(STATE.activeIdx),
  'toggle-mute': () => toggleMute(),

  'open-section': (el) => {
    playSfx('confirm');
    openSection(idxOf(el));
  },
  'open-items': () => openSection(1),
  'select-ally': (el) => {
    STATE.selectedAlly = idxOf(el);
    renderPartyHud();
    playSfx('hover');
  },

  'cast-skill': (el) => {
    const s = STATE.skills[idxOf(el)];
    const ally = currentAlly();
    if (!s) return;
    if (ally.sp < s.sp) return showToast('⚠️ SP insuficiente');
    ally.sp -= s.sp;
    if (s.heal > 0) STATE.party.forEach((p) => { p.hp = Math.min(p.maxHp, p.hp + s.heal); });
    playSfx('confirm');
    renderPartyHud();
    renderSection(0);
    showToast(`⚡ ${s.name} lanzado con éxito`);
  },

  'item-tab': (el) => {
    STATE.itemTab = el.dataset.val === 'shop' ? 'shop' : 'inventory';
    renderSection(1);
    playSfx('hover');
  },
  'use-item': (el) => {
    const it = STATE.items[idxOf(el)];
    if (!it) return;
    if (it.qty <= 0) return showToast('⚠️ Sin existencias en la mochila');
    it.qty--;
    const ally = currentAlly();
    ally.hp = Math.min(ally.maxHp, ally.hp + it.hp);
    ally.sp = Math.min(ally.maxSp, ally.sp + it.sp);
    playSfx('confirm');
    renderPartyHud();
    renderSection(1);
    showToast(`💊 Usaste ${it.name}`);
  },
  'buy-item': (el) => {
    const it = STATE.items[idxOf(el)];
    if (!it) return;
    if (STATE.wallet < it.price) return showToast('⚠️ Yenes insuficientes en tu billetera');
    it.qty++;
    playSfx('confirm');
    animateWallet(STATE.wallet - it.price);
    renderSection(1);
    showToast(`🛒 Compraste ${it.name} (-¥${it.price})`);
  },

  'equip': (el) => {
    const eq = STATE.armory[idxOf(el)];
    const ally = currentAlly();
    if (!eq) return;
    if (eq.slot === 'weapon') { ally.weapon = eq.name; ally.atk = eq.bonus; }
    else { ally.armor = eq.name; ally.def = eq.bonus; }
    playSfx('confirm');
    renderSection(2);
    showToast(`⚔️ ${eq.name} equipado a ${ally.name}`);
  },

  'fuse': () => {
    STATE.equippedPersona = 'Messiah (LV.91)';
    renderSection(3);
    playSfx('confirm');
    showToast('✨ ¡Fusión Arcana: Messiah LV.91 Despertado!');
  },
  'set-persona': (el) => {
    const p = PERSONAS.find((x) => x.name === el.dataset.val);
    if (!p) return;
    STATE.equippedPersona = p.name;
    renderSection(3);
    playSfx('confirm');
    showToast(`Persona invocada: ${p.name}`);
  },

  'train': (el) => {
    const key = el.dataset.key;
    if (!Object.hasOwn(STATE.stats, key)) return;
    STATE.stats[key] = Math.min(100, STATE.stats[key] + 6);
    renderSection(4);
    playSfx('confirm');
    showToast(`📈 +6 ${key}`);
  },

  'complete-quest': (el) => {
    const q = STATE.quests[idxOf(el)];
    if (!q || q.done) return;
    q.done = true;
    playSfx('confirm');
    animateWallet(STATE.wallet + q.reward);
    renderSection(5);
    showToast(`💰 Elizabeth depositó +¥${formatYen(q.reward)} en tu billetera`);
  },

  'bond-up': (el) => {
    const link = STATE.links[idxOf(el)];
    if (!link) return;
    link.rank = Math.min(10, link.rank + 1);
    renderSection(6);
    playSfx('confirm');
    showToast('💙 Vínculo Social subió de rango');
  },

  'set-day': (el) => {
    const d = el.dataset.val;
    if (!/^(0[1-9]|[12]\d|3[01])$/.test(d)) return;
    STATE.day = d;
    syncHud();
    renderSection(7);
    playSfx('confirm');
    showToast(`📅 Fecha cambiada a ${d} MAY`);
  },

  'set-theme': (el) => {
    const theme = el.dataset.val;
    if (!THEMES.includes(theme)) return;
    document.body.classList.remove('theme-p5', 'theme-p4');
    if (theme !== 'p3') document.body.classList.add(`theme-${theme}`);
    playSfx('confirm');
  },

  'dl-icon': (el) => {
    const key = el.dataset.key;
    if (!Object.hasOwn(ICONS, key)) return;
    playSfx('confirm');
    downloadSvg(`p3r-icon-${key}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n${ICONS[key]}`);
    showToast(`⬇️ Descargado: p3r-icon-${key}.svg`);
  },
  'dl-all': () => {
    playSfx('confirm');
    const sheet = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 160" width="768" height="320" style="background:#02104a">' +
      Object.keys(ICONS).map((k, i) => {
        const x = (i % 6) * 62 + 14;
        const y = Math.floor(i / 6) * 38 + 4;
        return `<g transform="translate(${x},${y})">${ICONS[k]}</g>`;
      }).join('') + '</svg>';
    downloadSvg('p3r-22-icons-pack.svg', sheet);
    showToast('⬇️ Pack completo de 22 iconos .SVG descargado');
  }
};

/* Hover / foco sobre el menú principal */
export function bindMenuHover() {
  const stack = $('menuStack');
  const activate = (e) => {
    const item = e.target.closest('.menu-item');
    if (!item) return;
    const idx = Number(item.dataset.idx);
    if (STATE.activeIdx !== idx) {
      playSfx('hover');
      setActiveMenu(idx);
    }
  };
  stack.addEventListener('mouseover', activate);
  stack.addEventListener('focusin', activate);
}

export function initUI() {
  renderControllerIcons();
  renderMenu();
  renderPartyHud();
  syncHud();
  syncInert();
  bindMenuHover();
  document.addEventListener('p3r:dive', syncInert);
}
