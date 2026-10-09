import { store } from './core/store.js';

export function applyTheme() {
  const t = store.data.settings.theme;
  const root = document.documentElement;
  if (t === 'light' || t === 'dark') {
    root.dataset.theme = t;
    delete root.dataset.auto;
  } else {
    delete root.dataset.theme;
    root.dataset.auto = '1'; // « Auto » : suit le réglage clair / sombre de l'appareil
  }
  const dark = t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0a0a0a' : '#fafafa');
}

export function applyFontSize() {
  const f = store.data.settings.fontSize || 'normal';
  // « normal » laisse la feuille de style choisir (texte un peu plus grand sur tablette)
  document.documentElement.style.fontSize = { grand: '112.5%', xl: '125%' }[f] || '';
}
