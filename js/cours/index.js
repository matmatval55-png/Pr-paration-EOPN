// Bibliothèque de cours : toutes les fiches à lire, regroupées par module.
import { CHAPTERS as MATHS } from '../maths/index.js';
import { CHAPTERS as PHYS } from '../physique/index.js';
import { FICHES_PSYCHO } from './psycho.js';
import { FICHES_ANGLAIS } from './anglais.js';
import { FICHES_CULTURE, FICHES_BIA } from './culture.js';
import { FICHES_VISUEL } from './visuel.js';
import { FICHES_ANIME } from './anime.js';
import { METHODE, QUESTIONS, THEMES } from '../entretien/data.js';
import { METHODE_GROUPE, ROLES } from '../entretien/groupe.js';
import { METHODE_PSY } from '../entretien/personnalite.js';
import { baremeTable } from '../pages/sport.js';

const fromChapters = (module, chapters) =>
  chapters.map((c) => ({
    id: c.id,
    title: c.title,
    sub: c.niveau,
    key: c.genId, // même clé que « cours lu » dans le chapitre
    train: `#/${module}/${c.id}/exos`,
    html: `${c.cours}<h2>🛠️ Méthode</h2>${c.methode}`,
  }));

const ENTRETIEN = [
  { id: 'methode', title: 'Préparer et réussir l’entretien', train: '#/entretien/simulation', html: METHODE },
  { id: 'psychologue', title: 'Questionnaires de personnalité et psychologue', train: '#/personnalite', html: METHODE_PSY },
  { id: 'groupe', title: 'Réussir l’épreuve de groupe', train: '#/train/ent.groupe', html: METHODE_GROUPE + '<h2>Les rôles utiles</h2>' + ROLES.map((r) => `<p><b>${r.ico} ${r.r}</b> : ${r.d}</p>`).join('') },
  ...THEMES.map((t, i) => ({
    id: 'theme-' + i,
    title: t,
    train: '#/entretien',
    html: QUESTIONS.filter((q) => q.theme === t)
      .map((q) => `<h3>« ${q.q} »</h3><p><b>Ce que le jury évalue :</b> ${q.attendu}</p><p><b>Comment structurer :</b> ${q.plan}</p><p><b>Pièges :</b> ${q.pieges}</p>`)
      .join(''),
  })),
];

const SPORT = [
  {
    id: 'epreuves',
    title: 'Les épreuves sportives',
    train: '#/sport',
    html: `
      <p>Épreuves confirmées par devenir-aviateur.gouv.fr : <b>Luc Léger</b>, <b>tractions</b> (hommes) ou <b>tirage de poulie haute</b> (femmes), <b>test Killy</b>. Les épreuves sportives et d’anglais peuvent être repassées (rattrapage).</p>
      <h3>Luc Léger</h3><p>Course en aller-retour sur 20 m au rythme de bips ; la vitesse augmente chaque minute (palier). Palier maximum : 12 (14 km/h). Les demi-tours comptent beaucoup : pied d’appui bas, regard vers la ligne suivante.</p>
      <h3>Tractions (hommes)</h3><p>Mains en pronation, déverrouillage complet des épaules et des coudes en bas, menton au-dessus de la barre en haut. Pas d’élan des jambes, pas de gants (magnésie autorisée).</p>
      <h3>Tirage poulie haute (femmes)</h3><p>Charge de 20 à 35 kg selon le poids, mains en pronation, extension complète en haut, barre à la poitrine en bas, sans s’arrêter.</p>
      <h3>Test Killy</h3><p>Position de la chaise contre un mur : dos, épaules et tête contre le mur, cuisses parallèles au sol, angles à 90°, pieds serrés, mains croisées sur la poitrine. On tient le plus longtemps possible (4 min max).</p>
      <h3>S’entraîner</h3><p>3 séances par semaine : endurance et fractionné, force du haut du corps, jambes et gainage. Toutes les 4 semaines, refais les 3 épreuves en conditions réelles. Le module Sport te propose un programme de 12 semaines adapté à ton niveau.</p>
      <p class="tip">Note minimale exigée pour les navigants : à vérifier auprès du CIRFA (le livret officiel ne la donne pas).</p>`,
  },
  { id: 'bareme-h', title: 'Barème officiel — hommes', train: '#/sport', html: `<p>Livret « Carnet évalué AAE », septembre 2025.</p>${baremeTable('H')}` },
  { id: 'bareme-f', title: 'Barème officiel — femmes', train: '#/sport', html: `<p>Livret « Carnet évalué AAE », septembre 2025.</p>${baremeTable('F')}` },
];

export const SECTIONS = [
  { id: 'psycho', ico: '🧠', title: 'Psychotechniques', fiches: FICHES_PSYCHO },
  { id: 'maths', ico: '📐', title: 'Maths', fiches: fromChapters('maths', MATHS) },
  { id: 'physique', ico: '⚛️', title: 'Physique', fiches: fromChapters('physique', PHYS) },
  { id: 'anglais', ico: '🇬🇧', title: 'Anglais', fiches: FICHES_ANGLAIS },
  { id: 'anime', ico: '🎬', title: 'Schémas animés : situations de vol', fiches: FICHES_ANIME },
  { id: 'visuel', ico: '🖼️', title: 'Fiches visuelles : culture de l’armée', fiches: FICHES_VISUEL },
  { id: 'culture', ico: '🎖️', title: 'Culture militaire et aéronautique', fiches: FICHES_CULTURE },
  { id: 'bia', ico: '🛩️', title: 'Révision du BIA', fiches: FICHES_BIA },
  { id: 'entretien', ico: '🎤', title: 'Entretien', fiches: ENTRETIEN },
  { id: 'sport', ico: '🏃', title: 'Sport', fiches: SPORT },
];

for (const s of SECTIONS) for (const f of s.fiches) f.key ||= `fiche.${s.id}.${f.id}`;
