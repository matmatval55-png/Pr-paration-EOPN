import { store } from './core/store.js';

export function applyTheme() {
  const t = store.data.settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
  const dark = t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1220' : '#f3f5f9');
}

export function applyFontSize() {
  const f = store.data.settings.fontSize || 'normal';
  document.documentElement.style.fontSize = { normal: '16px', grand: '18px', xl: '20px' }[f] || '16px';
}
