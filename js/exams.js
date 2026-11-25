// Tous les examens blancs de l'application (psychotechniques, anglais, culture…).
import { EXAMS as PSYCHO } from './psycho/index.js';

export const EXAMS = [...PSYCHO.map((e) => ({ back: '#/psycho', ...e }))];

export function addExams(list) {
  for (const e of list) if (!EXAMS.some((x) => x.id === e.id)) EXAMS.push(e);
}

const section = (title, gens, count, minutes) => ({ title, gens, count, time: minutes * 60 });
const logic = ['psy.suites-nombres', 'psy.matrices', 'psy.rotations', 'psy.cubes'];
const quantitative = ['maths.fractions', 'maths.proportionnalite', 'maths.trigo', 'physique.cinematique'];
const radio = ['psy.instruments', 'psy.horizon', 'psy.vent', 'psy.vor'];
const english = ['en.grammar', 'en.vocab', 'en.reading', 'en.phraseo'];

addExams([
  {
    id: 'diagnostic-general', title: 'Diagnostic général (40 min)', fixedComposition: true, fixedLevel: 2,
    desc: 'Échantillon de quatre domaines pour guider les premières séances.',
    sections: [
      section('Raisonnement cognitif', logic, 12, 10),
      section('Mathématiques et physique', quantitative, 12, 12),
      section('Anglais général et aéronautique', english, 12, 9),
      section('Instruments et navigation', radio, 12, 9),
    ],
  },
  {
    id: 'simulation-180', title: 'Simulation intensive (180 min)', fixedComposition: true,
    desc: 'Six blocs à réaliser dans les conditions d’une simulation non officielle.',
    sections: [
      section('Logique et spatial', logic, 32, 30),
      section('Mathématiques et physique', quantitative, 32, 36),
      section('Anglais général et aéronautique', english, 40, 32),
      section('Instruments et navigation', radio, 32, 30),
      section('Mémoire, attention et calcul', ['psy.memoire-chiffres', 'psy.codage', 'psy.comptage', 'psy.calcul'], 32, 30),
      section('Connaissances aéronautiques', ['bia.aero', 'bia.aeronefs', 'bia.meteo', 'bia.navreg'], 24, 22),
    ],
  },
  {
    id: 'coordination', title: 'Coordination et multitâche', fixedComposition: true, fixedLevel: 3,
    desc: 'Simulation cognitive sur les commandes disponibles dans le navigateur.',
    sections: [
      section('Poursuite, calcul et alertes', ['psy.multitache'], 1, 3),
      section('Manche et palonniers', ['psy.manche'], 1, 3),
    ],
  },
]);
