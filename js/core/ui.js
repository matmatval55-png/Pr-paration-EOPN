// Petites fonctions d'interface partagées.

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function pct(rate) {
  return rate == null ? '—' : Math.round(rate * 100) + ' %';
}

export function fmtMs(ms) {
  if (ms == null) return '—';
  const s = ms / 1000;
  if (s < 60) return s.toFixed(1).replace('.', ',') + ' s';
  const m = Math.floor(s / 60);
  return `${m} min ${String(Math.round(s % 60)).padStart(2, '0')}`;
}

export function toast(msg) {
  const t = el(`<div class="toast" role="status">${esc(msg)}</div>`);
  document.body.append(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

export function vibrate(ms) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* non supporté */
  }
}

// Pavé numérique à l'écran (le clavier natif des téléphones n'a souvent ni « - » ni « / »).
// onSubmit(texte) est appelé à la validation.
export function keypad({ onSubmit, allowFrac = true, allowNeg = true, placeholder = 'Ta réponse' }) {
  const root = el(`
    <div class="keypad">
      <div class="kp-display" aria-live="polite"><span class="kp-value"></span><span class="kp-ph">${esc(placeholder)}</span></div>
      <div class="kp-grid">
        ${['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((k) => `<button type="button" data-k="${k}">${k}</button>`).join('')}
        <button type="button" data-k="-" ${allowNeg ? '' : 'disabled'} aria-label="moins">−</button>
        <button type="button" data-k="0">0</button>
        <button type="button" data-k="," aria-label="virgule">,</button>
        <button type="button" data-k="/" ${allowFrac ? '' : 'disabled'} aria-label="fraction">/</button>
        <button type="button" data-k="del" aria-label="effacer">⌫</button>
        <button type="button" data-k="ok" class="kp-ok">Valider</button>
      </div>
    </div>`);
  let value = '';
  const disp = root.querySelector('.kp-value');
  const ph = root.querySelector('.kp-ph');
  const render = () => {
    disp.textContent = value;
    ph.hidden = value.length > 0;
  };
  const press = (k) => {
    if (k === 'del') value = value.slice(0, -1);
    else if (k === 'ok') {
      if (value.trim()) onSubmit(value);
      return;
    } else if (k === '-') value = value.startsWith('-') ? value.slice(1) : '-' + value;
    else if (value.length < 14) value += k;
    render();
  };
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-k]');
    if (b && !b.disabled) press(b.dataset.k);
  });
  const onKey = (e) => {
    if (!root.isConnected) return removeEventListener('keydown', onKey);
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === ',' || e.key === '.') press(',');
    else if (e.key === '/' && allowFrac) press('/');
    else if (e.key === '-' && allowNeg) press('-');
    else if (e.key === 'Backspace') press('del');
    else if (e.key === 'Enter') press('ok');
    else return;
    e.preventDefault();
  };
  addEventListener('keydown', onKey);
  render();
  root.disable = () => root.querySelectorAll('button').forEach((b) => (b.disabled = true));
  root.destroy = () => removeEventListener('keydown', onKey);
  return root;
}

// Parse une réponse numérique saisie (« 1,5 », « -3/4 », « 2 »). Renvoie NaN si invalide.
export function parseNum(txt) {
  const t = String(txt).replace(/\s/g, '').replace(',', '.');
  if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(t)) {
    const [a, b] = t.split('/').map(Number);
    return b === 0 ? NaN : a / b;
  }
  if (/^-?\d*\.?\d+$/.test(t)) return Number(t);
  return NaN;
}

export function confirmDialog(msg) {
  return window.confirm(msg);
}
