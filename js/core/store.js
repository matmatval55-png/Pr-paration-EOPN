// Sauvegarde locale (localStorage) + export / import JSON.
const KEY = 'eopn.v1';

const DEFAULT = () => ({
  version: 1,
  createdAt: Date.now(),
  settings: { theme: 'light', selectionDate: '', hoursPerWeek: 6, sex: 'H' },
  profile: { age: 18, studies: 'L1 droit', education: 'Bac général · maths et SES', english: 'B2', targetEnglish: 'C1', goals: 'EOPN, compétences transférables EOPAN et cadets', experience: 'Expérience régulière sur simulateur de vol et pratique sportive', dailyMinutes: 45 },
  days: {}, // 'AAAA-MM-JJ' -> { n, ok, ms }
  stats: {}, // idExercice -> { 'AAAA-MM-JJ': [n, ok, ms] }
  responseSamples: {}, // idExercice -> [jour, durée, résultat] (échantillon glissant)
  mistakes: {}, // carnet d’erreurs, indexé par graine et niveau
  srs: {}, // clé -> { spec, box, due, lapses }
  hist: {}, // idExercice -> empreintes de toutes les questions déjà posées (jamais de doublon)
  mastery: {}, // idExercice -> { lvl, best, n, ok, last, h } (niveau mémorisé, voir mastery.js)
  exams: [], // historique des examens blancs
  academy: {},
  progress: {}, // ex. 'maths.fractions' -> { read: true }
  sport: [], // tests et séances de sport
  personalCards: {}, // matière -> [[recto, verso], …]
  cards: {}, // flashcards : 'paquet|n' -> { box, due, seen }
  interview: { notes: {}, sessions: [] }, // entretien
  planning: { days: [0, 1, 2, 3, 4, 5, 6], done: {} },
  sante: { checks: {}, log: {} }, // médical : vérifications faites, journal quotidien
});

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const invalidBackup = () => new Error('Ce fichier n’est pas une sauvegarde Prépa EOPN valide.');

function parseBackup(text) {
  const parsed = JSON.parse(text, (key, value) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') throw invalidBackup();
    return value;
  });
  const data = parsed?.app === 'prepa-eopn' ? parsed.data : parsed;
  if (!isRecord(data) || !isRecord(data.stats) || (data.version != null && data.version !== 1)) {
    throw invalidBackup();
  }

  const defaults = DEFAULT();
  for (const [key, value] of Object.entries(defaults)) {
    if (!Object.hasOwn(data, key)) continue;
    if (isRecord(value) && !isRecord(data[key])) throw invalidBackup();
    if (Array.isArray(value) && !Array.isArray(data[key])) throw invalidBackup();
  }
  for (const series of Object.values(data.stats)) {
    if (!isRecord(series) || Object.values(series).some((row) =>
      !Array.isArray(row) || row.length < 3 || !row.slice(0, 3).every(Number.isFinite))) {
      throw invalidBackup();
    }
  }
  for (const samples of Object.values(data.responseSamples || {})) {
    if (!Array.isArray(samples) || samples.some((sample) => !Array.isArray(sample) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(sample[0]) || !Number.isFinite(sample[1]) ||
      !['correct', 'wrong', 'timeout'].includes(sample[2]))) throw invalidBackup();
  }
  for (const item of Object.values(data.mistakes || {})) {
    if (!isRecord(item) || !isRecord(item.spec) ||
      typeof item.spec.gen !== 'string' || !Number.isInteger(item.spec.level) ||
      !Number.isInteger(item.spec.seed) || !Number.isFinite(item.ts) ||
      !Number.isFinite(item.ms) || !Number.isInteger(item.count) || item.count < 1 ||
      !['prompt', 'expected', 'response', 'correction', 'cause'].every((key) => typeof item[key] === 'string')) {
      throw invalidBackup();
    }
  }
  for (const [module, cards] of Object.entries(data.personalCards || {})) {
    if (!['psycho', 'maths', 'physique', 'anglais', 'culture'].includes(module) ||
      !Array.isArray(cards) || cards.some((card) => !Array.isArray(card) || card.length !== 2 ||
        card.some((side) => typeof side !== 'string' || !side.trim() || side.length > 2000))) throw invalidBackup();
  }
  if (data.exams?.some((exam) => !isRecord(exam) ||
      !Number.isFinite(new Date(exam.ts).getTime()) || !Number.isFinite(exam.level) ||
      !Number.isFinite(exam.ok) || !Number.isFinite(exam.n) || exam.n <= 0)) {
    throw invalidBackup();
  }
  for (const exam of data.exams || []) {
    if (exam.skills == null) continue;
    if (!Array.isArray(exam.skills) || exam.skills.some((skill) => !isRecord(skill) ||
      typeof skill.gen !== 'string' || !['level', 'n', 'ok', 'omitted', 'timeouts'].every((key) =>
        Number.isInteger(skill[key]) && skill[key] >= 0) ||
      skill.n === 0 || skill.ok + skill.omitted + skill.timeouts > skill.n)) throw invalidBackup();
  }
  const snapshots = data.planning?.snapshots;
  if (snapshots != null && (!isRecord(snapshots) || Object.entries(snapshots).some(([date, blocks]) =>
    !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(blocks) || blocks.some((block) =>
      !isRecord(block) || !['psycho', 'maths', 'anglais', 'physique', 'culture', 'entretien', 'revision'].includes(block.mod) ||
      typeof block.key !== 'string' || !Number.isInteger(block.min) || block.min < 30 || block.min > 1800 || block.min % 30 !== 0 ||
      (block.source != null && !/^\d{4}-\d{2}-\d{2}$/.test(block.source)))))) throw invalidBackup();
  const restored = { ...defaults, ...data };
  for (const key of ['settings', 'profile', 'interview', 'planning', 'sante']) {
    restored[key] = { ...defaults[key], ...data[key] };
  }
  return restored;
}

let memory = null;
let storageOk = true;

function load() {
  if (memory) return memory;
  let data = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) data = JSON.parse(raw);
  } catch {
    storageOk = false;
  }
  memory = { ...DEFAULT(), ...(data || {}) };
  memory.settings = { ...DEFAULT().settings, ...(memory.settings || {}) };
  return memory;
}

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 150);
}
function flush() {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
    storageOk = true;
  } catch {
    storageOk = false;
  }
}
globalThis.addEventListener?.('pagehide', () => memory && flush());

export const store = {
  get data() {
    return load();
  },
  get storageOk() {
    load();
    return storageOk;
  },
  update(fn) {
    fn(load());
    save();
  },
  flush,
  exportJSON() {
    return JSON.stringify({ app: 'prepa-eopn', exportedAt: new Date().toISOString(), data: load() }, null, 1);
  },
  importJSON(text) {
    const restored = parseBackup(text);
    // Persister d'abord : une erreur de quota laisse la sauvegarde précédente disponible.
    localStorage.setItem(KEY, JSON.stringify(restored));
    clearTimeout(saveTimer);
    memory = restored;
    storageOk = true;
  },
  reset() {
    memory = DEFAULT();
    flush();
  },
};

export function today(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const j = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${j}`;
}
