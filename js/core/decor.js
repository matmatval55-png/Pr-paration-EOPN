// Habillage sobre de l'interface : les émojis décoratifs des titres sont retirés et ceux servant
// d'icônes (tuiles, listes, navigation) sont remplacés par des icônes au trait.
// Le contenu pédagogique (questions, schémas, corrections) n'est pas modifié.
import { icon, iconForEmoji } from './icons.js';

const E = '[\\p{Extended_Pictographic}\\u{1F1E6}-\\u{1F1FF}\\u200d\\ufe0f\\u20e3]';
const LEAD = new RegExp(`^\\s*(?:${E}+\\s*)+`, 'u');
const TRAIL = new RegExp(`(?:\\s*${E}+)+\\s*$`, 'u');
const PURE = new RegExp(`^\\s*(?:${E}+\\s*)+$`, 'u');
const SKIP = '.qcard, .q-visual, .sit-ico, .schema, .summary .review-item';

function firstText(el) {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP) });
  return w.nextNode();
}
function lastText(el) {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n, last = null;
  while ((n = w.nextNode())) if (n.nodeValue.trim()) last = n;
  return last;
}

function decorate(root) {
  if (!root.querySelectorAll) return;
  const all = (sel) => [...(root.matches?.(sel) ? [root] : []), ...root.querySelectorAll(sel)];
  // Icônes : élément dont le texte n'est qu'un émoji.
  for (const el of all('.tile > .ico, .row-link > span:first-child:not(.grow), .bottomnav .ico, .ico-slot')) {
    if (el.dataset.ic || el.closest(SKIP)) continue;
    const t = el.textContent;
    if (!PURE.test(t)) continue;
    el.dataset.ic = '1';
    el.classList.add('ic');
    el.removeAttribute('style');
    el.innerHTML = icon(iconForEmoji(t));
  }
  // Titres : émoji en tête retiré.
  for (const el of all('h1, h2, h3, h4, summary, .fb-head')) {
    if (el.dataset.dc || el.closest(SKIP)) continue;
    el.dataset.dc = '1';
    const n = firstText(el);
    if (n && LEAD.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(LEAD, '');
    const l = lastText(el);
    if (l && TRAIL.test(l.nodeValue)) l.nodeValue = l.nodeValue.replace(TRAIL, '');
  }
  // Chiffres clés : émoji en fin retiré (ex. « 12 🔥 »).
  for (const el of all('.stat b')) {
    const n = lastText(el);
    if (n && TRAIL.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(TRAIL, '');
  }
}

export function startDecor() {
  decorate(document.body);
  new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) decorate(n);
  }).observe(document.body, { childList: true, subtree: true });
}
