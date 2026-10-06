// Révision espacée (système de Leitner) : une question ratée revient le lendemain,
// puis à intervalles croissants à chaque réussite. Une nouvelle erreur la renvoie en boîte 0.
import { store } from './store.js';
import { getGen } from './registry.js';

const INTERVALS = [1, 3, 7, 14, 30]; // jours
const DAY = 86400000;

const keyOf = (spec) => `${spec.gen}|${spec.level}|${spec.seed}`;

export function onAnswer(spec, ok, fromReview = false) {
  if (!spec || !getGen(spec.gen) || getGen(spec.gen).noSrs) return;
  const k = keyOf(spec);
  store.update((s) => {
    const item = s.srs[k];
    if (!ok) {
      s.srs[k] = {
        spec,
        box: 0,
        due: Date.now() + (fromReview ? 10 * 60000 : 0),
        lapses: (item?.lapses || 0) + 1,
      };
    } else if (item && fromReview) {
      const box = item.box + 1;
      if (box >= INTERVALS.length) delete s.srs[k]; // acquise
      else s.srs[k] = { ...item, box, due: Date.now() + INTERVALS[box - 1] * DAY };
    }
  });
}

export function dueItems(now = Date.now()) {
  return Object.values(store.data.srs)
    .filter((it) => it.due <= now && getGen(it.spec.gen))
    .sort((a, b) => b.lapses - a.lapses || a.due - b.due);
}

export function srsCount() {
  return Object.keys(store.data.srs).length;
}
