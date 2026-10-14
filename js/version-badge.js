// Petit repère de version dans la barre du haut : une forme et une couleur qui changent à
// chaque mise à jour, pour vérifier d'un coup d'œil qu'on a bien la dernière version.
import { VERSION } from './version.js';

const SHAPES = [
  ['cercle', '<circle cx="12" cy="12" r="8"/>'],
  ['carré', '<rect x="4.5" y="4.5" width="15" height="15" rx="2"/>'],
  ['triangle', '<path d="M12 3.5 21 19.5H3z"/>'],
  ['losange', '<path d="M12 2.5 21.5 12 12 21.5 2.5 12z"/>'],
  ['étoile', '<path d="m12 2.8 2.7 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.6l-5.7 3.3 1.4-6.3L2.9 9.3l6.4-.6z"/>'],
  ['hexagone', '<path d="M12 2.5 20.2 7.2v9.6L12 21.5l-8.2-4.7V7.2z"/>'],
  ['cœur', '<path d="M12 20.5S3 14.6 3 8.7A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 9 2.1c0 5.9-9 11.8-9 11.8z"/>'],
  ['croix', '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>'],
  ['lune', '<path d="M15.5 3A9 9 0 1 0 21 15.5 7 7 0 0 1 15.5 3z"/>'],
  ['éclair', '<path d="M13.5 2 4.5 13.5H11l-1 8.5 9-11.5h-6.5z"/>'],
  ['goutte', '<path d="M12 2.5s7 7.6 7 12.3a7 7 0 0 1-14 0C5 10.1 12 2.5 12 2.5z"/>'],
];
const COLORS = [['rouge', '#ef4444'], ['orange', '#f97316'], ['jaune', '#eab308'], ['vert', '#22c55e'], ['turquoise', '#14b8a6'], ['bleu', '#3b82f6'], ['violet', '#a855f7'], ['rose', '#ec4899']];

export function versionMark(v = VERSION, size = 14) {
  const [shape, path] = SHAPES[v % SHAPES.length];
  const [color, hex] = COLORS[(v * 3) % COLORS.length];
  return { v, shape, color, svg: `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><g fill="${hex}">${path}</g></svg>` };
}

export function mountVersionBadge() {
  const m = versionMark();
  const a = document.createElement('a');
  a.className = 'ver-badge';
  a.href = '#/plus';
  a.title = `Version ${m.v} : ${m.shape} ${m.color}`;
  a.setAttribute('aria-label', a.title);
  a.innerHTML = `${m.svg}<span>v${m.v}</span>`;
  document.querySelector('.topbar .brand')?.after(a);
}
