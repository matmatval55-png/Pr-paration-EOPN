// Graphiques SVG légers (aucune bibliothèque, fonctionne hors ligne).
import { esc } from './ui.js';

// Courbe du taux de réussite quotidien. series = [{ d: 'AAAA-MM-JJ', n, rate }]
export function rateChart(series) {
  const W = 340, H = 150, L = 30, R = 8, T = 10, B = 22;
  const w = W - L - R, h = H - T - B;
  const x = (i) => L + (series.length === 1 ? w / 2 : (i / (series.length - 1)) * w);
  const y = (v) => T + h - v * h;
  const maxN = Math.max(1, ...series.map((s) => s.n));
  let grid = '';
  for (const v of [0, 0.5, 1]) grid += `<line class="grid-l" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 4}" y="${y(v) + 3}" text-anchor="end">${v * 100}%</text>`;
  const bars = series
    .map((s, i) => (s.n ? `<rect class="bar" x="${x(i) - 3}" y="${T + h - (s.n / maxN) * h}" width="6" height="${(s.n / maxN) * h}"/>` : ''))
    .join('');
  const pts = series.map((s, i) => (s.rate == null ? null : [x(i), y(s.rate)])).filter(Boolean);
  const path = pts.length ? `<polyline class="line" points="${pts.map((p) => p.join(',')).join(' ')}"/>` + pts.map(([a, b]) => `<circle class="dot" cx="${a}" cy="${b}" r="3"/>`).join('') : '';
  const lab = (i) => {
    const [, m, d] = series[i].d.split('-');
    const anchor = i === 0 ? 'start' : i === series.length - 1 ? 'end' : 'middle';
    return `<text x="${x(i)}" y="${H - 6}" text-anchor="${anchor}">${d}/${m}</text>`;
  };
  const labels = series.length ? lab(0) + lab(Math.floor((series.length - 1) / 2)) + lab(series.length - 1) : '';
  const empty = pts.length ? '' : `<text x="${W / 2}" y="${H / 2}" text-anchor="middle" style="font-size:12px">Pas encore de données</text>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution du taux de réussite">${grid}${bars}${path}${labels}${empty}</svg>
    <p class="small muted">Courbe : taux de réussite par jour · barres : nombre de questions.</p>`;
}

// Barres horizontales : items = [{ label, rate, sub }]
export function hbars(items) {
  return items
    .map((it) => {
      const v = it.rate == null ? 0 : it.rate;
      const cls = it.rate == null ? '' : v < 0.5 ? 'low' : v < 0.75 ? 'mid' : 'high';
      return `<div class="hbar"><span>${esc(it.label)}${it.sub ? `<br><span class="small muted">${esc(it.sub)}</span>` : ''}</span><div class="track"><div class="fill ${cls}" style="width:${Math.round(v * 100)}%"></div></div><span class="v">${it.rate == null ? '—' : Math.round(v * 100) + '%'}</span></div>`;
    })
    .join('');
}
