// Sauvegarde locale (localStorage) + export / import JSON.
const KEY = 'eopn.v1';

const DEFAULT = () => ({
  version: 1,
  createdAt: Date.now(),
  settings: { theme: 'auto', selectionDate: '', hoursPerWeek: 6, sex: 'H' },
  days: {}, // 'AAAA-MM-JJ' -> { n, ok, ms }
  stats: {}, // idExercice -> { 'AAAA-MM-JJ': [n, ok, ms] }
  srs: {}, // clé -> { spec, box, due, lapses }
  mastery: {}, // idExercice -> { lvl, best, n, ok, last, h } (niveau mémorisé, voir mastery.js)
  exams: [], // historique des examens blancs
  progress: {}, // ex. 'maths.fractions' -> { read: true }
  sport: [], // tests et séances de sport
  cards: {}, // flashcards : 'paquet|n' -> { box, due, seen }
  interview: { notes: {}, sessions: [] }, // entretien
  planning: { days: [0, 1, 2, 3, 4, 5, 6], done: {} },
});

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
    const parsed = JSON.parse(text);
    const data = parsed && parsed.app === 'prepa-eopn' ? parsed.data : parsed;
    if (!data || typeof data !== 'object' || !('stats' in data)) {
      throw new Error("Ce fichier n'est pas une sauvegarde Prépa EOPN.");
    }
    memory = { ...DEFAULT(), ...data, settings: { ...DEFAULT().settings, ...(data.settings || {}) } };
    flush();
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
