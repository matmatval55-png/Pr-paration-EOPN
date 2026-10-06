// Module Sport : épreuves, barème officiel, calculateur, suivi des performances et programme progressif.
import { BAREME, notes, fmtLeger, nextTarget } from '../sport/bareme.js';
import { store, today } from '../core/store.js';
import { recordActivity } from '../core/stats.js';
import { lineChart } from '../core/charts.js';
import { el, esc, toast } from '../core/ui.js';

const lastTest = () => store.data.sport.filter((t) => t.type === 'test').slice(-1)[0];

export function baremeTable(sex) {
  const rows = [];
  for (let i = 0; i < 20; i++) {
    rows.push(`<tr><td><b>${20 - i}</b></td><td>${fmtLeger(BAREME.leger[sex][i])}</td><td>${BAREME.killy[i]} s</td><td>${BAREME.bras[sex][i] ?? '/'}${i === 0 && sex === 'F' ? ' et +' : ''}</td></tr>`);
  }
  return `<div class="table-wrap"><table class="tbl"><tr><th>Note</th><th>Luc Léger (palier)</th><th>Killy</th><th>${sex === 'H' ? 'Tractions' : 'Poulie haute'}</th></tr>${rows.join('')}</table></div>`;
}

// Programme sur 12 semaines, construit à partir du dernier test.
export function weekPlan(week, sex, t) {
  const bras = t?.bras ?? 0, killy = t?.killy ?? 45, palier = t?.palier ?? 5;
  const k = Math.min(1.6, 1 + (week - 1) * 0.06); // progression ~6 %/semaine
  const testWeek = week % 4 === 0;
  if (testWeek)
    return [
      { t: 'Test complet', d: 'Échauffement 15 min, puis les 3 épreuves dans les conditions réelles et dans l’ordre (Luc Léger, force des bras, Killy). Note tes résultats dans « Ajouter un test ».' },
      { t: 'Récupération active', d: 'Footing très lent 25-30 min + étirements doux 10 min.' },
    ];
  const vmaReps = Math.min(16, 6 + Math.floor(week / 2) * 2);
  const run =
    week <= 4
      ? { t: 'Endurance + fractionné court', d: `Footing 20 min, puis ${vmaReps} × (30 s vite / 30 s trot). Retour au calme 10 min. Vise palier ${palier + 1} au prochain test.` }
      : week <= 8
        ? { t: 'Fractionné VMA', d: `Échauffement 15 min, puis 2 séries de ${Math.round(vmaReps / 2)} × (30 s / 30 s) à allure rapide, 3 min de récupération entre les séries. Termine par 10 min de trot.` }
        : { t: 'Navettes spécifiques Luc Léger', d: `Avec la bande sonore : enchaîne les paliers jusqu’à ${Math.max(palier, 5)}, récupère 3 min, puis 4 × 1 palier au-dessus de ton record. Travaille les demi-tours (pied d’appui bas, regard vers la ligne).` };
  let upper;
  if (sex === 'H') {
    if (bras < 3) upper = { t: 'Force des bras (débutant)', d: `5 × 3 tractions négatives (descente en 5 s), 3 × 20 s de suspension à la barre, 3 × 10 tirages horizontaux (« australian rows ») sous une table ou une barre basse. Gainage 3 × 30 s.` };
    else {
      const reps = Math.max(1, Math.round(bras * 0.6 * k));
      upper = { t: 'Tractions', d: `5 séries de ${reps} tractions strictes (menton au-dessus de la barre, bras tendus en bas), 2 min de récupération. Termine par 2 × max de pompes et 3 × 40 s de gainage.` };
    }
  } else {
    const reps = Math.max(8, Math.round((bras || 15) * 0.6 * k));
    upper = { t: 'Force des bras (poulie haute)', d: `En salle : 4 séries de ${reps} tirages poulie haute (charge du test, barre à la poitrine). Sans salle : 4 × 12 tirages avec élastique, 4 × 8 « australian rows ». Gainage 3 × 40 s.` };
  }
  const hold = Math.round(Math.max(30, killy * 0.6) * k);
  const legs = { t: 'Jambes et Killy', d: `4 × ${hold} s de chaise contre un mur (cuisses parallèles au sol, 90°), 1 min 30 de récupération. Puis 3 × 15 squats, 3 × 10 fentes par jambe, 3 × 30 s de gainage latéral.` };
  return [run, upper, legs];
}

export function renderSport(root) {
  const s = store.data.settings;
  const sex = s.sex || 'H';
  const tests = store.data.sport.filter((t) => t.type === 'test');
  const t = lastTest();
  const nt = t ? notes(sex, t) : null;
  const start = store.data.sportStart || today();
  const week = Math.min(12, Math.max(1, Math.floor((new Date(today()) - new Date(start)) / (7 * 86400000)) + 1));
  root.innerHTML = '';
  const page = el(`
    <div>
      <h1>Sport</h1>
      <p class="muted">Épreuves confirmées par la source officielle : <b>Luc Léger</b>, <b>${sex === 'H' ? 'tractions' : 'tirage de poulie haute'}</b> et <b>test Killy</b>. Barème : livret officiel de septembre 2025 (recrutement général ; la note minimale exigée des navigants est <b>à vérifier</b> auprès du CIRFA).</p>
      <div class="card">
        <h3>Mon dernier test</h3>
        ${
          nt
            ? `<div class="stat-row"><div class="stat"><b>${nt.leger}/20</b><span>Luc Léger (palier ${fmtLeger(t.palier * 60 + (+t.sec || 0))})</span></div><div class="stat"><b>${nt.bras}/20</b><span>${sex === 'H' ? 'tractions' : 'poulie'} (${t.bras})</span></div><div class="stat"><b>${nt.killy}/20</b><span>Killy (${t.killy} s)</span></div></div>
               <p class="center" style="font-size:1.2rem">Moyenne : <b>${nt.moyenne}/20</b></p>
               <p class="small muted">Prochains objectifs : ${[['Luc Léger', nextTarget(BAREME.leger[sex], t.palier * 60 + (+t.sec || 0)), fmtLeger], [sex === 'H' ? 'tractions' : 'poulie', nextTarget(BAREME.bras[sex], +t.bras), (v) => v], ['Killy', nextTarget(BAREME.killy, +t.killy), (v) => v + ' s']].map(([l, n, f]) => (n ? `${l} : ${f(n.value)} pour ${n.note}/20` : `${l} : note maximale !`)).join(' · ')}</p>`
            : '<p class="muted">Aucun test enregistré. Fais les 3 épreuves pour connaître ton niveau de départ.</p>'
        }
        <button class="btn primary block" data-add>➕ Ajouter un test</button>
      </div>
      <div class="add-form hidden card">
        <h3>Nouveau test</h3>
        <div class="field"><label>Date</label><input type="date" name="date" value="${today()}"></div>
        <div class="grid" style="grid-template-columns:1fr 1fr">
          <div class="field"><label>Luc Léger : palier atteint</label><input type="number" name="palier" min="0" max="20" value="${t?.palier ?? ''}"></div>
          <div class="field"><label>+ secondes</label><input type="number" name="sec" min="0" max="59" step="5" value="0"></div>
          <div class="field"><label>${sex === 'H' ? 'Tractions' : 'Poulie (répétitions)'}</label><input type="number" name="bras" min="0" max="80" value="${t?.bras ?? ''}"></div>
          <div class="field"><label>Killy (secondes)</label><input type="number" name="killy" min="0" max="240" value="${t?.killy ?? ''}"></div>
        </div>
        <p class="small muted calc-preview"></p>
        <button class="btn primary block" data-save>Enregistrer</button>
      </div>
      ${tests.length >= 2 ? `<div class="card"><h3>Progression (notes /20)</h3>${lineChart(tests.map((x) => ({ d: x.date, v: notes(sex, x).moyenne })), 20, 'Moyenne')}${lineChart(tests.map((x) => ({ d: x.date, v: notes(sex, x).leger })), 20, 'Luc Léger')}</div>` : ''}
      <div class="card">
        <h3>Programme — semaine ${week}/12</h3>
        <p class="small muted">3 séances par semaine (ex. lundi, mercredi, samedi), adaptées à ton dernier test. Toutes les 4 semaines : semaine de test.</p>
        <div class="list">${weekPlan(week, sex, t)
          .map((x, i) => `<div class="row-link" style="cursor:default"><span class="badge">${i + 1}</span><span class="grow"><span class="title">${esc(x.t)}</span><br><span class="sub">${esc(x.d)}</span></span><button class="btn-icon" data-done="${i}" aria-label="Séance faite">✓</button></div>`)
          .join('')}</div>
        <div class="btn-row" style="margin-top:10px"><button class="btn" data-prev ${week <= 1 ? 'disabled' : ''}>← Semaine précédente</button><button class="btn" data-nextw ${week >= 12 ? 'disabled' : ''}>Semaine suivante →</button></div>
        <button class="btn block small" data-restart>Recommencer le programme à la semaine 1</button>
      </div>
      <details class="card"><summary><b>📋 Barème officiel complet (${sex === 'H' ? 'hommes' : 'femmes'})</b></summary>${baremeTable(sex)}<p class="small muted">Change le barème (hommes/femmes) dans Réglages. Une case « / » signifie que la note n’existe pas pour cette épreuve.</p></details>
      <details class="card"><summary><b>ℹ️ Les épreuves</b></summary><div class="course">
        <p><b>Luc Léger</b> : course en aller-retour sur 20 m, au rythme de bips ; la vitesse augmente chaque minute (palier). Palier maximum : 12 (14 km/h). Entraîne-toi avec la bande sonore (facile à trouver en ligne).</p>
        <p><b>Tractions (hommes)</b> : mains en pronation, bras complètement tendus en bas, menton au-dessus de la barre en haut, sans élan des jambes. Gants interdits, magnésie autorisée.</p>
        <p><b>Tirage poulie haute (femmes)</b> : charge de 20 à 35 kg selon le poids, mains en pronation, extension complète en haut, barre à la poitrine en bas, sans s’arrêter.</p>
        <p><b>Killy</b> : dos, épaules et tête contre le mur, cuisses parallèles au sol (angles à 90°), pieds serrés, mains croisées sur la poitrine. Tenir le plus longtemps possible (4 min max).</p>
        <p class="tip">La source officielle conseille de s’entraîner en conditions réelles en enchaînant les trois épreuves. Ce programme est indicatif : demande l’avis d’un médecin si tu reprends le sport ou en cas de douleur.</p>
      </div></details>
    </div>`);
  root.append(page);

  const form = page.querySelector('.add-form');
  page.querySelector('[data-add]').onclick = () => form.classList.toggle('hidden');
  const read = () => Object.fromEntries([...form.querySelectorAll('input')].map((i) => [i.name, i.value]));
  const preview = () => {
    const v = read();
    const n = notes(sex, v);
    form.querySelector('.calc-preview').textContent = `Notes : Luc Léger ${n.leger}/20 · ${sex === 'H' ? 'tractions' : 'poulie'} ${n.bras}/20 · Killy ${n.killy}/20 → moyenne ${n.moyenne}/20`;
  };
  form.addEventListener('input', preview);
  preview();
  page.querySelector('[data-save]').onclick = () => {
    const v = read();
    if (!v.palier && !v.bras && !v.killy) return toast('Saisis au moins une performance');
    store.update((d) => {
      d.sport.push({ type: 'test', date: v.date || today(), palier: +v.palier || 0, sec: +v.sec || 0, bras: +v.bras || 0, killy: +v.killy || 0 });
      d.sport.sort((a, b) => (a.date < b.date ? -1 : 1));
      if (!d.sportStart) d.sportStart = today();
    });
    toast('Test enregistré ✓');
    renderSport(root);
  };
  page.querySelectorAll('[data-done]').forEach((b) =>
    (b.onclick = () => {
      store.update((d) => d.sport.push({ type: 'seance', date: today(), week, i: +b.dataset.done }));
      recordActivity(45 * 60000);
      b.textContent = '✔';
      b.disabled = true;
      toast('Séance enregistrée 💪');
    }),
  );
  const shift = (dw) => {
    store.update((d) => {
      const st = new Date(d.sportStart || today());
      st.setDate(st.getDate() - dw * 7);
      d.sportStart = today(st);
    });
    renderSport(root);
  };
  page.querySelector('[data-prev]').onclick = () => shift(-1);
  page.querySelector('[data-nextw]').onclick = () => shift(1);
  page.querySelector('[data-restart]').onclick = () => {
    store.update((d) => (d.sportStart = today()));
    renderSport(root);
  };
}
