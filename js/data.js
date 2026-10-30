/* Datos de la app: librería de iconos SVG (22) y estado inicial.
   Son constantes propias (no vienen de usuarios), por eso se inyectan con raw() en ui.js. */

export const ICONS = {
  skill: `<svg viewBox="0 0 32 32" fill="none"><polygon points="16,2 20,11 30,9 23,17 28,27 17,22 8,29 11,18 2,12 12,11" fill="#00f0ff" stroke="#05070d" stroke-width="2"/><polygon points="16,7 18,13 24,12 19,16 22,22 16,19 11,23 13,17 8,13 14,13" fill="#ffffff"/></svg>`,
  item: `<svg viewBox="0 0 32 32" fill="none"><polygon points="9,6 23,4 27,26 5,28" fill="#ff1f8f" stroke="#05070d" stroke-width="2"/><rect x="13" y="10" width="6" height="14" fill="#ffffff"/><rect x="9" y="14" width="14" height="6" fill="#ffffff"/></svg>`,
  equip: `<svg viewBox="0 0 32 32" fill="none"><polygon points="27,3 30,6 13,23 8,24 9,19" fill="#00f0ff" stroke="#05070d" stroke-width="2"/><polygon points="5,21 12,28 9,30 3,24" fill="#ffe600" stroke="#05070d" stroke-width="1.8"/></svg>`,
  persona: `<svg viewBox="0 0 32 32" fill="none"><path d="M5,10 L16,4 L27,10 L24,24 L16,29 L8,24 Z" fill="#ffffff" stroke="#05070d" stroke-width="2"/><polygon points="9,14 14,16 10,19" fill="#e60012"/><polygon points="23,14 18,16 22,19" fill="#0047cc"/></svg>`,
  stats: `<svg viewBox="0 0 32 32" fill="none"><polygon points="16,3 29,12 24,28 8,28 3,12" fill="#00f0ff" fill-opacity="0.35" stroke="#00f0ff" stroke-width="2.2"/><polygon points="16,8 24,14 21,24 11,24 8,14" fill="#ff1f8f"/></svg>`,
  quest: `<svg viewBox="0 0 32 32" fill="none"><polygon points="7,3 25,5 23,29 5,27" fill="#ffe600" stroke="#05070d" stroke-width="2"/><rect x="14" y="8" width="4" height="10" fill="#05070d"/><rect x="14" y="21" width="4" height="4" fill="#e60012"/></svg>`,
  social: `<svg viewBox="0 0 32 32" fill="none"><rect x="5" y="4" width="16" height="22" transform="rotate(-8 13 15)" fill="#00f0ff" stroke="#05070d" stroke-width="2"/><rect x="11" y="6" width="16" height="22" transform="rotate(8 19 17)" fill="#ff1f8f" stroke="#05070d" stroke-width="2"/></svg>`,
  calendar: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" fill="#ffe600" stroke="#05070d" stroke-width="2"/><path d="M18,6 A10,10 0 0,0 18,26 A8,10 0 0,1 18,6 Z" fill="#02104a"/></svg>`,
  system: `<svg viewBox="0 0 32 32" fill="none"><polygon points="16,2 20,7 27,5 25,12 30,16 25,20 27,27 20,25 16,30 12,25 5,27 7,20 2,16 7,12 5,5 12,7" fill="#00f0ff" stroke="#05070d" stroke-width="2"/><circle cx="16" cy="16" r="5" fill="#02104a"/></svg>`,
  btn_a: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#05070d" stroke-width="2.5"/><circle cx="16" cy="16" r="11.5" stroke="#00f0ff" stroke-width="1.5"/><path d="M16,8 L22,23 H18.8 L17.6,19.5 H14.4 L13.2,23 H10 L16,8 Z M16,12.8 L14.9,16.8 H17.1 L16,12.8 Z" fill="#05070d"/></svg>`,
  btn_b: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#05070d" stroke-width="2.5"/><circle cx="16" cy="16" r="11.5" stroke="#ff1f8f" stroke-width="1.5"/><path d="M11,8.5 H17.5 C20.2,8.5 21.8,10 21.8,12.2 C21.8,13.8 20.9,14.9 19.6,15.4 C21.3,15.9 22.3,17.2 22.3,19.1 C22.3,21.6 20.4,23 17.4,23 H11 V8.5 Z M14.2,11.2 V14.4 H16.9 C18.1,14.4 18.8,13.8 18.8,12.8 C18.8,11.8 18.1,11.2 16.9,11.2 H14.2 Z M14.2,16.8 V20.3 H17.2 C18.5,20.3 19.2,19.7 19.2,18.5 C19.2,17.4 18.5,16.8 17.2,16.8 H14.2 Z" fill="#05070d"/></svg>`,
  fire: `<svg viewBox="0 0 32 32" fill="none"><path d="M17,2 C22,10 28,14 25,23 C23,28 16,30 11,28 C6,25 6,17 11,13 C11,17 14,18 14,14 C13,9 15,5 17,2 Z" fill="#ff2e4c" stroke="#05070d" stroke-width="2"/></svg>`,
  ice: `<svg viewBox="0 0 32 32" fill="none"><polygon points="16,2 22,10 30,16 22,22 16,30 10,22 2,16 10,10" fill="#00f0ff" stroke="#05070d" stroke-width="2"/><polygon points="16,8 20,16 16,24 12,16" fill="#ffffff"/></svg>`,
  elec: `<svg viewBox="0 0 32 32" fill="none"><polygon points="19,2 7,17 16,17 12,30 26,14 17,14" fill="#ffe600" stroke="#05070d" stroke-width="2"/></svg>`,
  heal: `<svg viewBox="0 0 32 32" fill="none"><polygon points="16,3 20,12 29,16 20,20 16,29 12,20 3,16 12,12" fill="#5eff86" stroke="#05070d" stroke-width="2"/></svg>`,
  almighty: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" fill="#ffffff" stroke="#05070d" stroke-width="2"/><polygon points="16,2 19,13 30,16 19,19 16,30 13,19 2,16 13,13" fill="#ff1f8f"/></svg>`,
  yen: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" fill="#ffe600" stroke="#05070d" stroke-width="2"/><path d="M11,9 L16,16 L21,9 M11,16 H21 M11,20 H21 M16,16 V25" stroke="#05070d" stroke-width="2.5"/></svg>`,
  evoker: `<svg viewBox="0 0 32 32" fill="none"><polygon points="6,10 26,8 25,15 15,16 13,26 7,25" fill="#d9e8f5" stroke="#05070d" stroke-width="2"/><rect x="10" y="10" width="12" height="3" fill="#e60012"/></svg>`,
  tartarus: `<svg viewBox="0 0 32 32" fill="none"><polygon points="10,29 14,4 18,4 22,29" fill="#00f0ff" stroke="#05070d" stroke-width="2"/></svg>`,
  butterfly: `<svg viewBox="0 0 32 32" fill="none"><path d="M16,15 C8,3 2,8 5,16 C2,22 9,28 16,19 C23,28 30,22 27,16 C30,8 24,3 16,15 Z" fill="#00f0ff" stroke="#05070d" stroke-width="2"/></svg>`,
  chest: `<svg viewBox="0 0 32 32" fill="none"><rect x="4" y="9" width="24" height="16" fill="#ffe600" stroke="#05070d" stroke-width="2"/><rect x="4" y="14" width="24" height="4" fill="#05070d"/></svg>`,
  allout: `<svg viewBox="0 0 32 32" fill="none"><polygon points="16,1 20,10 30,6 24,15 31,23 21,22 18,31 13,22 3,25 8,16 2,8 12,10" fill="#e60012" stroke="#ffffff" stroke-width="1.8"/></svg>`
};

export const STATE = {
  activeIdx: 0,
  modalOpen: false,
  wallet: 3000,
  day: '01',
  month: 'MAY',
  selectedAlly: 0,
  itemTab: 'inventory',
  equippedPersona: 'Orpheus',
  stats: { Academics: 82, Charm: 76, Courage: 80, Expression: 74, Diligence: 85 },
  party: [
    { name: 'Makoto Yuki', hp: 188, maxHp: 210, sp: 96, maxSp: 115, weapon: 'Katana S.E.E.S.', armor: 'Chaqueta Gekkoukan', atk: 62, def: 48 },
    { name: 'Yukari Takeba', hp: 152, maxHp: 175, sp: 122, maxSp: 135, weapon: 'Arco Sirena', armor: 'Chaleco Ligero', atk: 49, def: 42 },
    { name: 'Junpei Iori', hp: 205, maxHp: 230, sp: 64, maxSp: 85, weapon: 'Mandoble Acero', armor: 'Peto Táctico', atk: 68, def: 54 }
  ],
  menus: [
    { name: 'SKILL', cmd: 'Use a Skill', icon: 'skill', sub: 'Grimorio de Magia Elemental y Teúrgia S.E.E.S.' },
    { name: 'ITEM', cmd: 'Use or Buy Items', icon: 'item', sub: 'Mochila Táctica y Farmacia Aohige (Conectada a ¥ 3,000)' },
    { name: 'EQUIP', cmd: 'Change Equipment', icon: 'equip', sub: 'Armería Oficial de la Comandancia Policial' },
    { name: 'PERSONA', cmd: 'Summon Personas', icon: 'persona', sub: 'Habitación Terciopelo // Fusión de Arcanos' },
    { name: 'STATS', cmd: 'Check Member Status', icon: 'stats', sub: 'Gráfico Pentagonal de Parámetros Sociales' },
    { name: 'QUEST', cmd: "Elizabeth's Requests", icon: 'quest', sub: 'Tablón de Encargos del Tártaro (Recompensas en Yenes)' },
    { name: 'SOCIAL LINK', cmd: 'Confidant Bonds', icon: 'social', sub: 'Red de Vínculos Sociales y Arcanos Mayores' },
    { name: 'CALENDAR', cmd: 'Check Lunar Schedule', icon: 'calendar', sub: 'Calendario Lunar Mayo 2009 (Actualiza el 01 MAY en vivo)' },
    { name: 'SYSTEM', cmd: 'System & 22 SVG Icons', icon: 'system', sub: 'Temas P3R/P5R/P4G y Descargador de 22 Iconos SVG (Incluye A y B)' }
  ],
  skills: [
    { name: 'Cadenza', sp: 24, heal: 65, icon: 'heal', desc: 'Teúrgia: Restaura +65 HP a todo el escuadrón y sube evasión.' },
    { name: 'Diarama', sp: 12, heal: 90, icon: 'heal', desc: 'Magia Curativa: Restaura +90 HP al miembro seleccionado.' },
    { name: 'Agidyne', sp: 16, heal: 0, icon: 'fire', desc: 'Fuego Severo: Llamarada carmesí de Orpheus (320 DMG).' },
    { name: 'Bufudyne', sp: 16, heal: 0, icon: 'ice', desc: 'Hielo Severo: Cristales de cero absoluto (315 DMG).' },
    { name: 'Ziodyne', sp: 16, heal: 0, icon: 'elec', desc: 'Eléctrico Severo: Descarga azul de alto voltaje (330 DMG).' },
    { name: 'Armageddon', sp: 45, heal: 210, icon: 'almighty', desc: 'Teúrgia Definitiva: 9999 DMG Todopoderoso + Curación Total.' }
  ],
  items: [
    { name: 'Medicine', qty: 4, price: 300, hp: 60, sp: 0, desc: 'Cápsula médica que restaura +60 HP a un aliado.' },
    { name: 'Soul Drop', qty: 3, price: 450, hp: 0, sp: 35, desc: 'Gota espiritual que restaura +35 SP para lanzar magia.' },
    { name: 'Snuff Soul', qty: 2, price: 800, hp: 0, sp: 70, desc: 'Incienso arcano que restaura +70 SP.' },
    { name: 'Soma', qty: 1, price: 1500, hp: 230, sp: 135, desc: 'Elixir sagrado que restaura el 100% de HP y SP del grupo.' }
  ],
  armory: [
    { name: 'Espada Lucifer', slot: 'weapon', bonus: 96, desc: 'Hoja forjada en el bloque Adamah (+96 ATK).' },
    { name: 'Katana Myohou Muramasa', slot: 'weapon', bonus: 82, desc: 'Filo maldito de crítico elevado (+82 ATK).' },
    { name: 'Armadura Mesías', slot: 'armor', bonus: 88, desc: 'Coraza radiante contra Sombras (+88 DEF).' }
  ],
  quests: [
    { title: '#01 Traer 1 Escarabajo Dorado de Arqa', reward: 1500, done: false },
    { title: '#02 Conseguir bebida Mad Bull de Iwatodai', reward: 900, done: false },
    { title: '#03 Fusionar a Messiah LV.91 en Velvet Room', reward: 2500, done: false },
    { title: '#04 Derrotar al Segador (The Reaper)', reward: 5000, done: false }
  ],
  links: [
    { arcana: '0. THE FOOL', person: 'Escuadrón S.E.E.S.', rank: 6 },
    { arcana: 'VI. THE LOVERS', person: 'Yukari Takeba', rank: 7 },
    { arcana: 'I. THE MAGICIAN', person: 'Junpei Iori', rank: 6 },
    { arcana: 'XIII. DEATH', person: 'Pharos', rank: 8 }
  ]
};
