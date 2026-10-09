// Exercices inspirés des tests de sélection pilote (types DLR, Air France, ENAC, préparés par
// exemple sur Pilotest) : N-back, mémoire défilante, compteurs, angles, cadrans, réaction à des signaux.
// Formats d'entraînement : les versions officielles (durées, nombre d'items) peuvent différer.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { keypad } from '../core/ui.js';

const M = 'psycho';
const COLORS = [['rouge', '#ef4444'], ['bleu', '#3b82f6'], ['vert', '#22c55e'], ['jaune', '#eab308']];
const SHAPES = ['cercle', 'carré', 'triangle', 'losange'];

export function shapeSVG(shape, color, size = 120) {
  const c = COLORS.find(([n]) => n === color)?.[1] || color;
  const d = {
    cercle: '<circle cx="50" cy="50" r="34"/>',
    carré: '<rect x="18" y="18" width="64" height="64" rx="6"/>',
    triangle: '<path d="M50 14 88 82H12z"/>',
    losange: '<path d="M50 10 88 50 50 90 12 50z"/>',
  }[shape];
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-label="${shape} ${color}"><g fill="${c}">${d}</g></svg>`;
}

const el = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};

/* ---------- 1. N-back ---------- */
register({
  id: 'psy.nback',
  module: M,
  group: 'Mémoire',
  title: 'N-back (mémoire de travail)',
  desc: 'Une forme apparaît à la fois : est-elle identique à celle vue N étapes avant ?',
  make(level, r) {
    const n = level;
    const total = 20 + n;
    const seq = [];
    for (let i = 0; i < total; i++) {
      if (i >= n && r.bool(0.33)) seq.push({ ...seq[i - n] });
      else {
        let it;
        do it = { s: r.pick(SHAPES), c: r.pick(COLORS)[0] };
        while (i >= n && it.s === seq[i - n].s && it.c === seq[i - n].c);
        seq.push(it);
      }
    }
    const target = seq.map((it, i) => i >= n && it.s === seq[i - n].s && it.c === seq[i - n].c);
    const ms = { 1: 2200, 2: 2400, 3: 2600 }[level];
    return {
      kind: 'custom',
      timeLimit: 0,
      prompt: `<b>${n}-back</b> : pour chaque forme, réponds <b>OUI</b> si elle est identique (forme <b>et</b> couleur) à celle vue <b>${n} étape${n > 1 ? 's' : ''} avant</b>, sinon <b>NON</b>. ${total} formes, ${(ms / 1000).toFixed(1).replace('.', ',')} s chacune.`,
      explain: `<p>Le N-back mesure la <b>mémoire de travail</b> : garder en tête une liste qui se met à jour en permanence.</p><p class="tip">Méthode : répète mentalement les ${n + 1} dernières formes (« rouge-carré, bleu-cercle… ») et fais glisser la liste à chaque nouvelle forme. Ne t’arrête pas sur une erreur : la suivante arrive déjà.</p>`,
      mount(area, finish) {
        const box = el(`<div class="pt-box"><div class="pt-stage"></div><p class="center muted pt-info">Prépare-toi…</p><div class="btn-row"><button class="btn" data-a="0" disabled>NON</button><button class="btn primary" data-a="1" disabled>OUI</button></div></div>`);
        area.append(box);
        const stage = box.querySelector('.pt-stage');
        const info = box.querySelector('.pt-info');
        const btns = [...box.querySelectorAll('[data-a]')];
        const answers = Array(total).fill(null);
        let i = -1;
        let t = null;
        const step = () => {
          i++;
          if (i >= total) return end();
          stage.innerHTML = shapeSVG(seq[i].s, seq[i].c);
          info.textContent = `${i + 1} / ${total}${i < n ? ' · mémorise' : ''}`;
          btns.forEach((b) => (b.disabled = i < n));
          t = setTimeout(step, ms);
        };
        btns.forEach((b) => (b.onclick = () => {
          if (i < n || i >= total || answers[i] != null) return;
          answers[i] = b.dataset.a === '1';
          btns.forEach((x) => (x.disabled = true));
        }));
        const onKey = (e) => {
          if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'n') btns[0].click();
          if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'o') btns[1].click();
        };
        addEventListener('keydown', onKey);
        const end = () => {
          removeEventListener('keydown', onKey);
          btns.forEach((b) => (b.disabled = true));
          let good = 0, hits = 0, miss = 0, fa = 0;
          for (let k = n; k < total; k++) {
            const a = answers[k] === true;
            if (a === target[k]) good++;
            if (target[k] && a) hits++;
            if (target[k] && !a) miss++;
            if (!target[k] && a) fa++;
          }
          const rate = good / (total - n);
          stage.innerHTML = `<div class="pt-score">${Math.round(rate * 100)} %</div>`;
          finish({ ok: rate >= 0.8, explainExtra: `<p>${good} bonnes réponses sur ${total - n} (${Math.round(rate * 100)} %) · ${hits} identiques repérées, ${miss} oubliées, ${fa} fausse(s) alerte(s). Objectif : 80 %.</p>` });
        };
        t = setTimeout(step, 1200);
        return () => {
          clearTimeout(t);
          removeEventListener('keydown', onKey);
        };
      },
    };
  },
});

/* ---------- 2. Mémoire défilante (running memory span) ---------- */
register({
  id: 'psy.defilante',
  module: M,
  group: 'Mémoire',
  title: 'Mémoire défilante',
  desc: 'Des chiffres défilent sans que tu saches quand ça s’arrête : retiens toujours les derniers.',
  make(level, r) {
    const k = { 1: 3, 2: 4, 3: 5 }[level];
    const len = r.int(k + 3, k + 9);
    const ds = Array.from({ length: len }, () => r.int(1, 9));
    const expected = ds.slice(-k).join('');
    const ms = { 1: 1000, 2: 850, 3: 700 }[level];
    return {
      kind: 'custom',
      timeLimit: 0,
      prompt: `Des chiffres vont défiler. À la fin, tape les <b>${k} derniers</b>, dans l’ordre. Tu ne sais pas quand la liste s’arrête !`,
      explain: `<p>Suite : ${ds.join(' ')} → les ${k} derniers : <b>${expected}</b>.</p><p class="tip">Méthode : garde une « fenêtre » de ${k} chiffres que tu mets à jour à chaque nouveau chiffre (le plus ancien sort). Répète-la en rythme dans ta tête.</p>`,
      mount(area, finish) {
        const stage = el('<div class="pt-stage pt-digit"></div>');
        area.append(stage);
        let i = 0;
        let t = null;
        const step = () => {
          if (i >= len) {
            stage.textContent = '?';
            const kp = keypad({ allowFrac: false, allowNeg: false, placeholder: `${k} derniers chiffres`, onSubmit: (txt) => {
              kp.disable?.();
              const ok = txt.replace(/\D/g, '') === expected;
              finish({ ok, explainExtra: ok ? '' : `<p>Ta réponse : ${txt} · attendu : <b>${expected}</b>.</p>` });
            } });
            area.append(kp);
            return;
          }
          stage.textContent = ds[i];
          stage.classList.remove('pt-pop');
          void stage.offsetWidth;
          stage.classList.add('pt-pop');
          i++;
          t = setTimeout(() => {
            stage.textContent = '';
            t = setTimeout(step, 150);
          }, ms);
        };
        t = setTimeout(step, 900);
        return () => clearTimeout(t);
      },
    };
  },
});

/* ---------- 3. Compteurs ---------- */
register({
  id: 'psy.compteurs',
  module: M,
  group: 'Attention',
  title: 'Test des compteurs',
  desc: 'Plusieurs compteurs changent au fil des consignes : donne la valeur finale de l’un d’eux.',
  make(level, r) {
    const names = ['A', 'B', 'C', 'D'].slice(0, { 1: 2, 2: 3, 3: 4 }[level]);
    const start = Object.fromEntries(names.map((n) => [n, r.int(0, 5)]));
    const val = { ...start };
    const steps = [];
    const nb = { 1: 6, 2: 9, 3: 12 }[level];
    for (let i = 0; i < nb; i++) {
      const n = r.pick(names);
      let d = r.pick([-3, -2, -1, 1, 2, 3]);
      if (val[n] + d < 0) d = Math.abs(d);
      val[n] += d;
      steps.push([n, d]);
    }
    const ask = r.pick(names);
    const ms = { 1: 1800, 2: 1500, 3: 1200 }[level];
    return {
      kind: 'custom',
      timeLimit: 0,
      prompt: `Retiens les valeurs de départ, puis applique chaque consigne. À la fin, on te demandera la valeur d’<b>un</b> des compteurs (${names.length} compteurs, ${nb} consignes).`,
      explain: `<p>Départ : ${names.map((n) => `${n} = ${start[n]}`).join(', ')}.</p><p>Consignes : ${steps.map(([n, d]) => `${n} ${d > 0 ? '+' : '−'}${Math.abs(d)}`).join(' · ')}.</p><p>Valeurs finales : ${names.map((n) => `${n} = <b>${val[n]}</b>`).join(', ')}.</p><p class="tip">Méthode : récite les valeurs de tous les compteurs après chaque consigne (« A 3, B 5, C 1 ») : c’est plus fiable que de retenir les opérations.</p>`,
      mount(area, finish) {
        const stage = el(`<div class="pt-counters"></div>`);
        const msg = el('<div class="pt-stage pt-digit"></div>');
        area.append(stage, msg);
        stage.innerHTML = names.map((n) => `<div class="pt-counter"><span>${n}</span><b>${start[n]}</b></div>`).join('');
        let i = -1;
        let t = setTimeout(function step() {
          i++;
          if (i === 0) stage.querySelectorAll('b').forEach((b) => (b.textContent = '?'));
          if (i >= steps.length) {
            msg.innerHTML = `<span class="small">Valeur de <b>${ask}</b> ?</span>`;
            const kp = keypad({ allowFrac: false, allowNeg: true, placeholder: `Compteur ${ask}`, onSubmit: (txt) => {
              kp.disable?.();
              const ok = Number(txt.replace(',', '.')) === val[ask];
              finish({ ok, explainExtra: ok ? '' : `<p>${ask} valait <b>${val[ask]}</b>.</p>` });
            } });
            area.append(kp);
            return;
          }
          const [n, d] = steps[i];
          msg.textContent = `${n} ${d > 0 ? '+' : '−'} ${Math.abs(d)}`;
          msg.classList.remove('pt-pop');
          void msg.offsetWidth;
          msg.classList.add('pt-pop');
          t = setTimeout(step, ms);
        }, 3500 + names.length * 500);
        return () => clearTimeout(t);
      },
    };
  },
});

/* ---------- 4. Angles ---------- */
export function angleSVG(a, rot) {
  const R = 80;
  const p = (deg) => [100 + R * Math.cos((deg * Math.PI) / 180), 100 - R * Math.sin((deg * Math.PI) / 180)];
  const [x1, y1] = p(rot);
  const [x2, y2] = p(rot + a);
  return `<svg viewBox="0 0 200 200" width="220" class="instr" aria-label="angle"><line x1="100" y1="100" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="100" y1="100" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="100" r="3.5" fill="currentColor"/></svg>`;
}

register({
  id: 'psy.angles',
  module: M,
  group: 'Raisonnement spatial',
  title: 'Estimation d’angles',
  desc: 'Estimer d’un coup d’œil l’angle entre deux droites.',
  make(level, r) {
    const step = { 1: 15, 2: 10, 3: 5 }[level];
    const a = r.int(Math.ceil(15 / step), Math.floor(165 / step)) * step;
    const gap = { 1: 30, 2: 20, 3: 10 }[level];
    const rot = r.int(0, 71) * 5;
    const distract = [a - 3 * gap, a - 2 * gap, a - gap, a + gap, a + 2 * gap, a + 3 * gap].filter((x) => x > 0 && x < 180).sort((x, y) => Math.abs(x - a) - Math.abs(y - a)).slice(0, 4).map((x) => `${x}°`);
    const { choices, answer } = buildChoices(r, `${a}°`, r.shuffle(distract), 4);
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: 'Quel est l’angle formé par ces deux segments ?',
      visual: angleSVG(a, rot),
      choices,
      answer,
      explain: `<p>L’angle mesure <b>${a}°</b>.</p><p class="tip">Repères : 90° = angle droit (coin de feuille), 45° = moitié d’un angle droit, 180° = droite. Compare à ces repères puis ajuste : « un peu plus qu’un droit » ≈ 100-110°.</p>`,
      timeLimit: { 1: 12, 2: 10, 3: 8 }[level],
    };
  },
});

/* ---------- 5. Cadrans ---------- */
export function dialSVG(label, v, lo, hi, size = 110) {
  // échelle 0-100 sur un arc de 270° (de -225° à +45°)
  const ang = (x) => -225 + (x / 100) * 270;
  const pt = (deg, rr) => [50 + rr * Math.cos((deg * Math.PI) / 180), 50 + rr * Math.sin((deg * Math.PI) / 180)];
  const arc = (a0, a1, rr) => {
    const [x0, y0] = pt(ang(a0), rr);
    const [x1, y1] = pt(ang(a1), rr);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${rr} ${rr} 0 ${ang(a1) - ang(a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const [nx, ny] = pt(ang(v), 30);
  return `<svg viewBox="0 0 100 112" width="${size}" aria-label="cadran ${label}"><circle cx="50" cy="50" r="44" fill="var(--instr-bg)" stroke="currentColor" stroke-width="2"/><path d="${arc(0, 100, 38)}" fill="none" stroke="var(--line)" stroke-width="6"/><path d="${arc(lo, hi, 38)}" fill="none" stroke="#22c55e" stroke-width="6"/><line x1="50" y1="50" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="4" fill="currentColor"/><text x="50" y="108" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">${label}</text></svg>`;
}

register({
  id: 'psy.cadrans',
  module: M,
  group: 'Instruments',
  title: 'Surveillance de cadrans',
  desc: 'Repérer en un coup d’œil le cadran dont l’aiguille sort de la zone verte.',
  make(level, r) {
    const n = { 1: 4, 2: 6, 3: 6 }[level];
    const margin = { 1: 18, 2: 12, 3: 6 }[level];
    const labels = 'ABCDEF'.slice(0, n).split('');
    const bad = r.int(0, n - 1);
    const dials = labels.map((l, i) => {
      const lo = r.int(10, 40);
      const hi = lo + r.int(30, 45);
      let v;
      if (i === bad) v = r.bool() && lo - margin - 3 > 0 ? r.int(Math.max(0, lo - margin - 10), lo - margin) : r.int(Math.min(100, hi + margin), Math.min(100, hi + margin + 10));
      else v = r.int(lo + 4, hi - 4);
      return { l, v, lo, hi };
    });
    const { choices, answer } = buildChoices(r, labels[bad], labels.filter((x) => x !== labels[bad]), Math.min(4, n));
    return {
      kind: 'mcq',
      layout: 'row',
      prompt: 'Quel cadran indique une valeur <b>hors</b> de sa zone verte ?',
      visual: `<div class="pt-dials">${dials.map((d) => dialSVG(d.l, d.v, d.lo, d.hi)).join('')}</div>`,
      choices,
      answer,
      explain: `<p>Le cadran <b>${labels[bad]}</b> est hors zone (aiguille à ${dials[bad].v}, zone ${dials[bad].lo}-${dials[bad].hi}).</p><p class="tip">Méthode du pilote : un balayage régulier (le « circuit visuel »), en regardant seulement si chaque aiguille est dans le vert, sans lire les valeurs.</p>`,
      timeLimit: { 1: 8, 2: 7, 3: 6 }[level],
    };
  },
});

/* ---------- 6. Réaction à des signaux (go / no-go) ---------- */
const RULES = {
  1: { txt: 'un <b>carré rouge</b>', test: (x) => x.s === 'carré' && x.c === 'rouge' },
  2: { txt: 'un <b>carré rouge</b> ou un <b>cercle bleu</b>', test: (x) => (x.s === 'carré' && x.c === 'rouge') || (x.s === 'cercle' && x.c === 'bleu') },
  3: { txt: 'une forme <b>rouge</b>, sauf si c’est un <b>triangle</b> ; ou un <b>cercle bleu</b>', test: (x) => (x.c === 'rouge' && x.s !== 'triangle') || (x.s === 'cercle' && x.c === 'bleu') },
};

register({
  id: 'psy.reaction',
  module: M,
  group: 'Attention',
  title: 'Réaction à des signaux',
  desc: 'Des formes défilent vite : touche seulement pour les cibles définies par la règle.',
  make(level, r) {
    const rule = RULES[level];
    const total = 24;
    const seq = [];
    for (let i = 0; i < total; i++) {
      let x;
      const want = r.bool(0.35);
      let guard = 0;
      do x = { s: r.pick(SHAPES), c: r.pick(COLORS.slice(0, 3))[0] };
      while (rule.test(x) !== want && ++guard < 50);
      seq.push(x);
    }
    const ms = { 1: 1300, 2: 1150, 3: 1000 }[level];
    return {
      kind: 'custom',
      timeLimit: 0,
      prompt: `Touche <b>TOP</b> (ou la barre d’espace) dès que tu vois ${rule.txt}. Ne touche rien pour les autres formes.`,
      explain: `<p>Ce test mesure la <b>vitesse de réaction</b> et le <b>contrôle</b> (ne pas réagir aux mauvais signaux).</p><p class="tip">Méthode : formule la règle en une phrase courte avant de commencer et garde le doigt prêt. Mieux vaut une réaction un peu plus lente qu’une fausse alerte.</p>`,
      mount(area, finish) {
        const box = el(`<div class="pt-box"><div class="pt-stage"></div><p class="center muted pt-info">Prépare-toi…</p><button class="btn primary block pt-go" type="button">TOP</button></div>`);
        area.append(box);
        const stage = box.querySelector('.pt-stage');
        const info = box.querySelector('.pt-info');
        const go = box.querySelector('.pt-go');
        const resp = Array(total).fill(null);
        let i = -1, shownAt = 0, t = null;
        const press = () => {
          if (i < 0 || i >= total || resp[i] != null) return;
          resp[i] = performance.now() - shownAt;
          stage.classList.add('pt-pressed');
        };
        go.onclick = press;
        const onKey = (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            press();
          }
        };
        addEventListener('keydown', onKey);
        const step = () => {
          i++;
          stage.classList.remove('pt-pressed');
          if (i >= total) return end();
          stage.innerHTML = shapeSVG(seq[i].s, seq[i].c, 110);
          info.textContent = `${i + 1} / ${total}`;
          shownAt = performance.now();
          t = setTimeout(() => {
            stage.innerHTML = '';
            t = setTimeout(step, 250);
          }, ms);
        };
        const end = () => {
          removeEventListener('keydown', onKey);
          go.disabled = true;
          let good = 0, hits = 0, miss = 0, fa = 0;
          const rts = [];
          seq.forEach((x, k) => {
            const tgt = rule.test(x);
            const p = resp[k] != null;
            if (tgt === p) good++;
            if (tgt && p) (hits++, rts.push(resp[k]));
            if (tgt && !p) miss++;
            if (!tgt && p) fa++;
          });
          const rt = rts.length ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : null;
          stage.innerHTML = `<div class="pt-score">${good}/${total}</div>`;
          finish({ ok: good / total >= 0.85 && fa <= 2, explainExtra: `<p>${hits} cibles touchées, ${miss} manquée(s), ${fa} fausse(s) alerte(s)${rt ? ` · temps de réaction moyen : <b>${rt} ms</b>` : ''}. Objectif : au moins 85 % et 2 fausses alertes maximum.</p>` });
        };
        t = setTimeout(step, 1500);
        return () => {
          clearTimeout(t);
          removeEventListener('keydown', onKey);
        };
      },
    };
  },
});
