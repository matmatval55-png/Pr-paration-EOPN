// Checklist de candidature EOPN : étapes à cocher, avec date et source de chaque élément.
import { store } from '../core/store.js';
import { el, esc } from '../core/ui.js';

const O = 'officiel', V = 'à vérifier', C = 'conseil';

export const STEPS = [
  {
    title: '1. Se renseigner',
    items: [
      ['info-officiel', 'Lire la page officielle « Se préparer aux tests » (devenir-aviateur.gouv.fr)', O, 'https://devenir-aviateur.gouv.fr/postuler/tout-savoir-pour-postuler/passer-les-tests-d-evaluation/se-preparer-aux-tests'],
      ['conditions', 'Vérifier les conditions : nationalité française, bac, moins de 27 ans à la signature du contrat', O, '#/selection'],
      ['cirfa-rdv', 'Prendre rendez-vous avec un conseiller du CIRFA le plus proche', O, 'https://devenir-aviateur.gouv.fr'],
      ['cirfa-questions', 'Demander au CIRFA : dates des sessions EOPN, lieu de présélection (Tours ou centre régional), notes minimales exigées en sport et en anglais pour les navigants', V],
      ['jdc', 'Avoir effectué la Journée défense et citoyenneté (JDC) et garder l’attestation', V],
    ],
  },
  {
    title: '2. Dossier administratif',
    items: [
      ['cni', 'Carte nationale d’identité en cours de validité', O],
      ['vitale', 'Carte vitale et attestation de mutuelle (si tu en as une)', O],
      ['diplomes', 'Copies du bac et des relevés de notes, certificat de scolarité (L1)', V],
      ['bia', 'Copie de l’attestation du BIA', C],
      ['motivation', 'Lettre de motivation ou CV si le CIRFA le demande', V],
    ],
  },
  {
    title: '3. Dossier médical (indispensable)',
    items: [
      ['carnet', 'Carnet de santé et carnet de vaccination à jour', O],
      ['dossier-med', 'Tous les documents médicaux : radios, scanners, IRM, bilans sanguins, dernière ordonnance si traitement, comptes rendus d’hospitalisation et de consultation', O],
      ['dentaire', 'Certificat bucco-dentaire', O],
      ['lunettes', 'Lunettes ou lentilles si tu en portes', O],
      ['questionnaire', 'Questionnaire de santé de l’École de l’air (le demander / le télécharger)', V, 'https://www.ecole-air-espace.fr/wp-content/uploads/2021/02/questionnaire-de-sante.pdf'],
      ['bilan-perso', 'Faire un bilan chez l’ophtalmologiste et le dentiste quelques mois avant, pour ne pas découvrir un problème le jour J', C],
    ],
    note: 'Le livret officiel précise : « Si votre dossier médical n’est pas complet, votre candidature peut être ajournée ! »',
  },
  {
    title: '4. Préparation (dans l’application)',
    items: [
      ['prep-diag', 'Faire le test de positionnement en maths', C, '#/maths/test'],
      ['prep-tamic', 'Réussir au moins 70 % à l’examen blanc type TAMI-C (niveau moyen)', C, '#/exam/tamic'],
      ['prep-nav', 'Faire plusieurs fois l’examen blanc « tests spécifiques navigants »', C, '#/exam/navigant'],
      ['prep-chambery', 'Faire le test type Chambéry complet (150 q / 55 min) en conditions réelles', C, '#/exam/en-chambery'],
      ['prep-sport', 'Faire un test sportif complet (Luc Léger + bras + Killy) en conditions réelles', C, '#/sport/leger'],
      ['prep-entretien', 'Faire au moins 10 simulations d’entretien enregistrées et se faire interroger par une vraie personne', C, '#/entretien/simulation'],
      ['prep-actu', 'Préparer 2 sujets d’actualité de défense à résumer en 1 minute', C, '#/fiche/culture/defense'],
      ['prep-chefs', 'Connaître les noms actuels du ministre des Armées, du CEMA et du CEMAAE', C],
      ['prep-vol', 'Faire au moins un vol (baptême, vol d’initiation, planeur) pour nourrir l’entretien', C],
    ],
  },
  {
    title: '5. Les 4 jours à Tours',
    items: [
      ['tenue', 'Tenue sobre et correcte pour l’entretien (exemple officiel : chemise blanche et jean)', O],
      ['sport-tenue', 'Tenue et chaussures de sport adaptées à la course (Luc Léger) ; magnésie si tu veux (gants interdits aux tractions)', O],
      ['docs-jour', 'Tous les documents administratifs et médicaux dans une pochette', O],
      ['sommeil', 'Bien dormir les jours précédents ; pas de révisions tardives la veille', C],
    ],
  },
  {
    title: '6. Après les tests',
    items: [
      ['commission', 'Dossier étudié en commission pour la sélection finale', O],
      ['medical-pn', 'Visite médicale du personnel navigant (lieu et date communiqués par l’armée)', V],
      ['resultat', 'Résultat : en cas d’échec, demander un retour pour savoir quoi travailler et quand retenter', C],
    ],
  },
];

export function checklistProgress() {
  const all = STEPS.flatMap((s) => s.items);
  const done = all.filter(([id]) => store.data.checklist?.[id]?.done).length;
  return { done, total: all.length };
}

export function renderChecklist(root) {
  const cl = store.data.checklist || {};
  const { done, total } = checklistProgress();
  root.innerHTML = '';
  const page = el(`
    <div>
      <h1>✅ Checklist de candidature</h1>
      <p class="muted">Toutes les étapes, de la prise de contact avec le CIRFA aux résultats. Chaque élément indique sa source : <span class="badge ok">officiel</span> (devenir-aviateur.gouv.fr), <span class="badge warn">à vérifier</span> (à confirmer avec ton CIRFA) ou <span class="badge">conseil</span>.</p>
      <div class="card"><div class="section-res" style="border:0"><span><b>${done}</b> / ${total} étapes</span><b>${Math.round((done / total) * 100)} %</b></div><div class="progress"><div style="width:${(done / total) * 100}%"></div></div></div>
      ${STEPS.map(
        (s) => `<div class="card"><h3>${esc(s.title)}</h3>${s.note ? `<p class="tip">${esc(s.note)}</p>` : ''}${s.items
          .map(([id, txt, src, link]) => {
            const st = cl[id] || {};
            const badge = src === O ? 'ok' : src === V ? 'warn' : '';
            return `<div class="check-item"><label class="check"><input type="checkbox" data-id="${id}" ${st.done ? 'checked' : ''}><span>${esc(txt)} <span class="badge ${badge}">${src}</span>${link ? ` <a href="${link}" ${link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>→</a>` : ''}${st.date ? `<br><span class="small muted">fait le ${new Date(st.date).toLocaleDateString('fr-FR')}</span>` : ''}</span></label></div>`;
          })
          .join('')}</div>`,
      ).join('')}
    </div>`);
  root.append(page);
  page.querySelectorAll('input[data-id]').forEach((c) =>
    (c.onchange = () => {
      const y = scrollY;
      store.update((d) => {
        d.checklist ||= {};
        d.checklist[c.dataset.id] = c.checked ? { done: true, date: Date.now() } : { done: false };
      });
      renderChecklist(root);
      scrollTo(0, y);
    }),
  );
}
