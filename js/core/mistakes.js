import { store } from './store.js';
import { getGen } from './registry.js';

export const CAUSES = [
  'Manque de connaissances', 'Erreur de méthode', 'Erreur de calcul',
  'Inattention', 'Mauvaise compréhension', 'Manque de temps', 'Autre',
];

export const mistakeKey = ({ gen, level, seed }) => `${gen}|${level}|${seed}`;

function plain(value) {
  const text = String(value ?? '');
  if (typeof document === 'undefined') return text;
  const template = document.createElement('template');
  template.innerHTML = text;
  return template.content.textContent.trim();
}

export function recordMistake({ spec, q, given, ms, timeout }) {
  const key = mistakeKey(spec);
  const expected = q.kind === 'mcq' ? q.choices[q.answer] : q.answerText ?? q.answer;
  const response = q.kind === 'mcq' ? plain(q.choices[given]) : String(given ?? '');
  store.update((s) => {
    const old = s.mistakes[key];
    s.mistakes[key] = {
      spec, prompt: plain(q.prompt), expected: plain(expected), response,
      correction: plain(q.explain), ms, timeout: !!timeout, ts: Date.now(),
      count: (old?.count || 0) + 1, cause: old?.cause || '',
    };
  });
}

export function classifyMistake(key, cause) {
  if (cause && !CAUSES.includes(cause)) return;
  store.update((s) => {
    if (s.mistakes[key]) s.mistakes[key].cause = cause;
  });
}

export function mistakeEntries({ module = '', cause = '' } = {}) {
  return Object.entries(store.data.mistakes)
    .filter(([, item]) => (!module || getGen(item.spec.gen)?.module === module) && (!cause || item.cause === cause))
    .sort(([, a], [, b]) => b.count - a.count || b.ts - a.ts);
}
