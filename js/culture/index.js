// Culture générale et aéronautique + révision du BIA.
import { registerBank } from '../core/bank.js';
import { addExams } from '../exams.js';
import { HISTOIRE, AAE, DEFENSE } from './histoire-aae.js';
import { AERO, AERONEFS, METEO, NAVREG } from './bia.js';
import { HISTOIRE_EXTRA, AAE_EXTRA, DEFENSE_EXTRA, BIA_AERO_EXTRA, BIA_AERONEFS_EXTRA, BIA_METEO_EXTRA, BIA_NAVREG_EXTRA } from './extra.js';

const M = 'culture';
export const GROUPS = ['Culture militaire et aéronautique', 'Révision du BIA'];
const C = GROUPS[0], B = GROUPS[1];

registerBank({ id: 'cult.histoire', module: M, group: C, title: 'Histoire de l’aviation', desc: 'Des Montgolfier à Thomas Pesquet.', items: [...HISTOIRE, ...HISTOIRE_EXTRA], timeLimit: 30 });
registerBank({ id: 'cult.aae', module: M, group: C, title: 'Armée de l’Air et de l’Espace', desc: 'Histoire, grades, bases, aéronefs, missions.', items: [...AAE, ...AAE_EXTRA], timeLimit: 30 });
registerBank({ id: 'cult.defense', module: M, group: C, title: 'Défense et géopolitique', desc: 'OTAN, ONU, dissuasion, opérations, institutions.', items: [...DEFENSE, ...DEFENSE_EXTRA], timeLimit: 30 });
registerBank({ id: 'bia.aero', module: M, group: B, title: 'Aérodynamique et mécanique du vol', desc: 'Profil, portance, décrochage, gouvernes, finesse.', items: [...AERO, ...BIA_AERO_EXTRA], timeLimit: 30 });
registerBank({ id: 'bia.aeronefs', module: M, group: B, title: 'Connaissance des aéronefs', desc: 'Moteurs, instruments, structure, hélicoptères.', items: [...AERONEFS, ...BIA_AERONEFS_EXTRA], timeLimit: 30 });
registerBank({ id: 'bia.meteo', module: M, group: B, title: 'Météorologie', desc: 'Atmosphère, nuages, fronts, METAR, dangers.', items: [...METEO, ...BIA_METEO_EXTRA], timeLimit: 30 });
registerBank({ id: 'bia.navreg', module: M, group: B, title: 'Navigation et réglementation', desc: 'Cartes, caps, règles de l’air, espaces, organismes.', items: [...NAVREG, ...BIA_NAVREG_EXTRA], timeLimit: 30 });

addExams([
  {
    id: 'bia-blanc',
    back: '#/culture',
    title: 'BIA blanc (60 q)',
    desc: '12 questions par thème, comme une épreuve de BIA (format réduit).',
    sections: [
      { title: 'Aérodynamique et mécanique du vol', gens: ['bia.aero'], count: 12, time: 12 * 60 },
      { title: 'Connaissance des aéronefs', gens: ['bia.aeronefs'], count: 12, time: 12 * 60 },
      { title: 'Météorologie', gens: ['bia.meteo'], count: 12, time: 12 * 60 },
      { title: 'Navigation et réglementation', gens: ['bia.navreg'], count: 12, time: 12 * 60 },
      { title: 'Histoire de l’aéronautique', gens: ['cult.histoire'], count: 12, time: 12 * 60 },
    ],
  },
  {
    id: 'culture-blanc',
    back: '#/culture',
    title: 'Culture militaire (30 q)',
    desc: 'Armée de l’Air et de l’Espace, défense, histoire — utile pour l’entretien.',
    sections: [{ title: 'Culture militaire', gens: ['cult.aae', 'cult.defense', 'cult.histoire'], count: 30, time: 15 * 60 }],
  },
]);
