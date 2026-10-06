// Flashcards avec répétition espacée (boîtes de Leitner) — module anglais.
import { DECKS } from '../anglais/index.js';
import { store } from '../core/store.js';
import { recordActivity } from '../core/stats.js';
import { el, esc } from '../core/ui.js';

const DAY = 86400000;
const INTERVALS = [0, 1, 3, 7, 14, 30];

function cardState(deck, i) {
  return store.data.cards?.[`${deck}|${i}`] || { box: 0, due: 0, seen: false };
}

export function deckStats(deck) {
  const now = Date.now();
  let due = 0, learned = 0, fresh = 0;
  deck.cards.forEach((_, i) => {
    const c = cardState(deck.id, i);
    if (!c.seen) fresh++;
    else if (c.due <= now) due++;
    if (c.box >= 3) learned++;
  });
  return { due, learned, fresh, total: deck.cards.length };
}

export function renderFlashList(root) {
  root.innerHTML = `
    <a href="#/anglais" class="small">← Anglais</a>
    <h1>Flashcards</h1>
    <p class="muted">Retourne la carte, puis dis honnêtement si tu savais. Les cartes connues reviennent de plus en plus rarement (1, 3, 7, 14, 30 jours), les autres reviennent tout de suite.</p>
    <div class="list">${DECKS.map((d) => {
      const s = deckStats(d);
      return `<a class="row-link" href="#/flashcards/${d.id}"><span class="grow"><span class="title">${esc(d.title)}</span><br><span class="sub">${s.total} cartes · ${s.learned} maîtrisées · ${s.fresh} nouvelles</span></span>${s.due ? `<span class="badge warn">${s.due} à revoir</span>` : ''}<span class="chev">›</span></a>`;
    }).join('')}</div>`;
}

export function renderFlashDeck(root, id) {
  const deck = DECKS.find((d) => d.id === id);
  if (!deck) return renderFlashList(root);
  const now = Date.now();
  const idx = deck.cards.map((_, i) => i);
  const due = idx.filter((i) => cardState(id, i).seen && cardState(id, i).due <= now).sort((a, b) => cardState(id, a).box - cardState(id, b).box);
  const fresh = idx.filter((i) => !cardState(id, i).seen);
  let queue = [...due, ...fresh].slice(0, 20);
  let reverse = false;
  let done = 0, known = 0;
  const t0 = performance.now();

  root.innerHTML = '';
  const page = el(`
    <div>
      <a href="#/flashcards" class="small">← Paquets</a>
      <h1>${esc(deck.title)}</h1>
      <div class="seg" style="margin-bottom:10px"><button data-dir="0" class="on">Recto → verso</button><button data-dir="1">Verso → recto</button></div>
      <div class="flash-area"></div>
    </div>`);
  root.append(page);
  const area = page.querySelector('.flash-area');
  page.querySelectorAll('[data-dir]').forEach((b) =>
    (b.onclick = () => {
      reverse = b.dataset.dir === '1';
      page.querySelectorAll('[data-dir]').forEach((x) => x.classList.toggle('on', x === b));
      show();
    }),
  );

  function grade(i, ok) {
    store.update((s) => {
      s.cards ||= {};
      const c = cardState(id, i);
      const box = ok ? Math.min(c.box + 1, INTERVALS.length - 1) : 0;
      s.cards[`${id}|${i}`] = { box, due: Date.now() + INTERVALS[box] * DAY, seen: true };
    });
    done++;
    if (ok) known++;
    queue.shift();
    if (!ok) queue.splice(Math.min(queue.length, 3), 0, i); // revient quelques cartes plus loin
    show();
  }

  function show() {
    if (!queue.length) {
      recordActivity(performance.now() - t0, done);
      area.innerHTML = `<div class="card center"><h2>Séance terminée ✅</h2><p>${known} réponse(s) « je savais » sur ${done}.</p><a class="btn primary block" href="#/flashcards">Autres paquets</a></div>`;
      return;
    }
    const i = queue[0];
    const [front, back] = reverse ? [deck.cards[i][1], deck.cards[i][0]] : deck.cards[i];
    area.innerHTML = `
      <p class="small muted center">${queue.length} carte(s) restante(s)</p>
      <button class="flashcard" type="button"><span class="fc-front">${esc(front)}</span><span class="fc-back" hidden>${esc(back)}</span><span class="fc-hint small muted">Touche pour retourner</span></button>
      <div class="btn-row fc-grade" hidden><button class="btn danger" data-k="0">✗ Je ne savais pas</button><button class="btn primary" data-k="1">✓ Je savais</button></div>`;
    const card = area.querySelector('.flashcard');
    card.onclick = () => {
      card.classList.add('flipped');
      card.querySelector('.fc-back').hidden = false;
      card.querySelector('.fc-hint').hidden = true;
      area.querySelector('.fc-grade').hidden = false;
    };
    area.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => grade(i, b.dataset.k === '1')));
  }
  if (!queue.length) {
    area.innerHTML = `<div class="card center"><p>✅ Rien à revoir dans ce paquet pour aujourd’hui.</p><button class="btn block" data-all>Réviser quand même tout le paquet</button></div>`;
    area.querySelector('[data-all]').onclick = () => {
      queue = idx.sort(() => Math.random() - 0.5).slice(0, 20);
      show();
    };
  } else show();
}
