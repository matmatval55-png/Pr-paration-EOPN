// Médical et hygiène de vie : ce qu'il faut faire vérifier tôt, l'aptitude médicale expliquée,
// et un journal quotidien (sommeil, sport, caféine, alcool, forme) avec conseils.
import { store, today } from '../core/store.js';
import { lineChart } from '../core/charts.js';
import { el, esc } from '../core/ui.js';

const V = '⚠️ à vérifier';

export const VERIFS = [
  { id: 'ophtalmo', ico: '👁️', t: 'Ophtalmologiste (le plus important)', d: 'Demande un bilan complet en précisant que tu vises le personnel navigant : acuité de loin et de près avec et sans correction, réfraction (myopie, hypermétropie, astigmatisme), vision des couleurs, vision du relief, champ visuel, tension oculaire. Garde le compte rendu écrit.' },
  { id: 'chirurgie', ico: '🔬', t: 'Pas de chirurgie des yeux sans avis', d: `Ne fais aucune opération de correction de la vue (laser…) avant d’avoir demandé ce qu’en pensent le CIRFA ou un CEMPN : les règles pour les navigants sont spécifiques. ${V}` },
  { id: 'orl', ico: '👂', t: 'Audition (ORL ou audiogramme)', d: 'Un audiogramme vérifie ton audition. Protège tes oreilles dès maintenant (concerts, écouteurs trop forts).' },
  { id: 'dentiste', ico: '🦷', t: 'Dentiste', d: 'Fais tous les soins bien avant (caries, dents de sagesse si besoin) et demande le certificat bucco-dentaire, demandé dans le dossier.' },
  { id: 'generaliste', ico: '🩺', t: 'Médecin traitant', d: 'Fais le point sur tes antécédents (asthme, allergies, fractures, migraines, opérations, traitements) et récupère tous les comptes rendus. Un dossier incomplet peut faire ajourner la candidature.' },
  { id: 'vaccins', ico: '💉', t: 'Vaccins à jour', d: 'Vérifie ton carnet de vaccination avec ton médecin.' },
  { id: 'mensurations', ico: '📏', t: 'Mesures du corps', d: `Les sièges éjectables et les cockpits imposent des limites de taille et de mensurations (taille, taille assise, longueur des jambes…). Renseigne-toi auprès du CIRFA sur les valeurs actuelles. ${V}` },
  { id: 'questionnaire', ico: '📄', t: 'Questionnaire de santé', d: 'Demande-le au CIRFA ou télécharge-le sur le site de l’École de l’air et de l’espace, et réponds-y honnêtement : une omission découverte plus tard est bien plus grave.' },
];

export const SIGYCOP = [
  ['S', 'Ceinture scapulaire et membres supérieurs'],
  ['I', 'Ceinture pelvienne et membres inférieurs'],
  ['G', 'État général'],
  ['Y', 'Yeux et vision (hors couleurs)'],
  ['C', 'Vision des couleurs'],
  ['O', 'Oreilles et audition'],
  ['P', 'Psychisme'],
];

const num = (v) => (v === '' || v == null ? null : Number(v));
const dayOffset = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return today(d);
};

// Moyennes et conseils sur les 7 derniers jours renseignés.
export function healthAdvice(log) {
  const days = Object.keys(log).sort().slice(-7).map((k) => log[k]);
  if (!days.length) return { avg: null, tips: [] };
  const avg = (f) => {
    const v = days.map(f).filter((x) => x != null && !Number.isNaN(x));
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };
  const a = { sleep: avg((d) => num(d.sleep)), sport: avg((d) => num(d.sport)), caf: avg((d) => num(d.caf)), alc: days.reduce((s, d) => s + (num(d.alc) || 0), 0), mood: avg((d) => num(d.mood)), screens: days.filter((d) => d.screens).length };
  const tips = [];
  if (a.sleep != null && a.sleep < 7) tips.push(`😴 Tu dors en moyenne ${a.sleep.toFixed(1).replace('.', ',')} h. Vise 8 h : le sommeil consolide ce que tu as appris et améliore la vitesse aux tests.`);
  else if (a.sleep != null) tips.push(`✅ Sommeil correct (${a.sleep.toFixed(1).replace('.', ',')} h en moyenne). Garde des horaires réguliers.`);
  if (a.screens >= 3) tips.push(`📱 Écrans après 23 h ${a.screens} soir(s) sur ${days.length} : la lumière des écrans retarde l’endormissement.`);
  if (a.caf != null && a.caf > 3) tips.push('☕ Plus de 3 cafés ou boissons énergisantes par jour : ça dégrade le sommeil et augmente le stress. Réduis progressivement.');
  if (a.alc > 7) tips.push(`🍺 ${a.alc} verres d’alcool sur la semaine : l’alcool dégrade le sommeil, la récupération sportive et la mémoire.`);
  if (a.sport != null && a.sport < 30) tips.push('🏃 Moins de 30 min de sport par jour en moyenne : vise 3 à 4 séances par semaine pour le Luc Léger et les tractions.');
  if (a.mood != null && a.mood <= 2) tips.push('💬 Forme basse plusieurs jours de suite : allège le programme, parle-en à un proche. La préparation est un marathon.');
  return { avg: a, tips };
}

export function renderSante(root) {
  const draw = () => {
    const s = (store.data.sante ||= { checks: {}, log: {} });
    const t = today();
    const cur = s.log[t] || {};
    const { avg, tips } = healthAdvice(s.log);
    const series = Array.from({ length: 14 }, (_, i) => dayOffset(13 - i)).filter((d) => num(s.log[d]?.sleep) != null).map((d) => ({ d, v: num(s.log[d].sleep) }));
    const nChecks = VERIFS.filter((v) => s.checks[v.id]).length;
    root.innerHTML = '';
    const page = el(`<div>
      <h1>🩺 Médical et hygiène de vie</h1>
      <p class="muted">Le médical est le critère le plus éliminatoire et le seul que l’entraînement ne change pas. Fais vérifier ce qui peut l’être <b>dès maintenant</b>, pour pouvoir corriger à temps (soins dentaires, dossier complet…).</p>
      <div class="card"><h3>À faire vérifier tôt (${nChecks}/${VERIFS.length})</h3>
        ${VERIFS.map((v) => `<label class="check"><input type="checkbox" data-check="${v.id}" ${s.checks[v.id] ? 'checked' : ''}><span><b>${v.ico} ${esc(v.t)}</b><br><span class="small">${esc(v.d)}</span></span></label>`).join('')}
      </div>
      <details class="card"><summary><b>📘 L’aptitude médicale expliquée</b></summary>
        <p>Le résultat de l’expertise médicale militaire s’exprime sous la forme d’un profil <b>SIGYCOP</b> : 7 lettres, chacune notée par un coefficient (1 = meilleur). Les normes à atteindre dépendent de la spécialité. Pour le personnel navigant, elles sont plus exigeantes, notamment pour la vision (acuité, couleurs) et l’audition, avec des standards « aviation ».</p>
        <table class="tbl" style="text-align:left">${SIGYCOP.map(([l, d]) => `<tr><td><b>${l}</b></td><td>${d}</td></tr>`).join('')}</table>
        <ul><li>L’expertise d’admission des navigants se fait dans un <b>CEMPN</b> (centre d’expertise médicale du personnel navigant).</li><li>Texte de référence : arrêté du 12 février 2021 relatif aux normes médicales d’aptitude du personnel militaire de l’armée de l’air (consultable sur Légifrance), avec une annexe pour le personnel navigant.</li><li>En cas d’inaptitude, des recours et dérogations existent (commissions spécialisées) : renseigne-toi si c’est ton cas, ne renonce pas seul.</li></ul>
        <p class="tip">Les valeurs chiffrées (acuité minimale, correction maximale…) dépendent de la spécialité et évoluent : fais-les confirmer par le CIRFA ou un CEMPN. ${V}.</p>
        <p class="small"><a href="https://www.ecole-air-espace.fr/wp-content/uploads/2021/03/arretes-normes-medicales-AIR-MECA-BASES.pdf" target="_blank" rel="noopener">Normes médicales (document de l’École de l’air et de l’espace)</a></p>
      </details>
      <div class="card"><h3>📓 Journal du jour (${new Date().toLocaleDateString('fr-FR')})</h3>
        <div class="form-grid">
          <label>Sommeil (h)<input type="number" inputmode="decimal" step="0.5" min="0" max="14" data-f="sleep" value="${cur.sleep ?? ''}"></label>
          <label>Sport (min)<input type="number" inputmode="numeric" min="0" max="400" data-f="sport" value="${cur.sport ?? ''}"></label>
          <label>Cafés / boissons énergisantes<input type="number" inputmode="numeric" min="0" max="20" data-f="caf" value="${cur.caf ?? ''}"></label>
          <label>Verres d’alcool<input type="number" inputmode="numeric" min="0" max="30" data-f="alc" value="${cur.alc ?? ''}"></label>
        </div>
        <label class="check"><input type="checkbox" data-f="screens" ${cur.screens ? 'checked' : ''}><span>Écrans après 23 h</span></label>
        <div class="field"><label>Forme du jour</label><div class="seg" data-f="mood">${[1, 2, 3, 4, 5].map((v) => `<button data-v="${v}" class="${String(cur.mood) === String(v) ? 'on' : ''}">${['😫', '😕', '😐', '🙂', '💪'][v - 1]}</button>`).join('')}</div></div>
        <p class="small muted">Enregistré automatiquement, uniquement sur ton téléphone.</p>
      </div>
      ${tips.length ? `<div class="card"><h3>💡 Tes 7 derniers jours</h3>${tips.map((x) => `<p>${esc(x)}</p>`).join('')}</div>` : ''}
      ${series.length >= 2 ? `<div class="card">${lineChart(series, 12, 'Sommeil (h), 14 derniers jours')}</div>` : ''}
      ${avg ? `<div class="stat-row"><div class="stat"><b>${avg.sleep != null ? avg.sleep.toFixed(1).replace('.', ',') : '—'}</b><span>h de sommeil / nuit</span></div><div class="stat"><b>${avg.sport != null ? Math.round(avg.sport) : '—'}</b><span>min de sport / jour</span></div><div class="stat"><b>${Object.keys(s.log).length}</b><span>jours notés</span></div></div>` : ''}
      <details class="card"><summary><b>🍽️ Les bases d’une bonne hygiène de vie</b></summary><ul>
        <li><b>Sommeil</b> : 8 h, horaires réguliers, même le week-end. C’est le premier levier de performance aux tests.</li>
        <li><b>Alimentation</b> : 3 vrais repas, des féculents avant les grosses séances, de l’eau tout au long de la journée.</li>
        <li><b>Tabac et vapotage</b> : à arrêter, ils réduisent l’endurance (Luc Léger).</li>
        <li><b>Médicaments et compléments</b> : rien sans avis médical, et signale tout traitement à la visite.</li>
        <li><b>Écrans</b> : coupe 30 min avant de dormir.</li>
        <li><b>Récupération</b> : au moins un jour de repos sportif par semaine.</li>
      </ul></details>
    </div>`);
    root.append(page);
    const set = (f, v) =>
      store.update((d) => {
        d.sante ||= { checks: {}, log: {} };
        const e = (d.sante.log[t] ||= {});
        if (v === '' || v == null || v === false) delete e[f];
        else e[f] = v;
        if (!Object.keys(e).length) delete d.sante.log[t];
      });
    page.querySelectorAll('[data-check]').forEach((c) =>
      c.addEventListener('change', () => {
        store.update((d) => {
          d.sante ||= { checks: {}, log: {} };
          if (c.checked) d.sante.checks[c.dataset.check] = Date.now();
          else delete d.sante.checks[c.dataset.check];
        });
        draw();
      }),
    );
    page.querySelectorAll('input[data-f]').forEach((i) => i.addEventListener('change', () => (set(i.dataset.f, i.type === 'checkbox' ? i.checked : i.value), draw())));
    page.querySelector('.seg[data-f="mood"]').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      set('mood', b.dataset.v);
      draw();
    });
  };
  draw();
}
