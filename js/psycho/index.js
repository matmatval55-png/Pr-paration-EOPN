// Point d'entrée du module psychotechnique : charge les générateurs et définit les examens blancs.
import './suites.js';
import './spatial.js';
import './mecanique.js';
import './attention.js';
import './memoire.js';
import './calcul.js';
import './multitache.js';
import './instruments.js';
import './verbal.js';
import './psychomoteur.js';
import './situations.js';
import './situations2.js';
import './structuration.js';
import './pilotest.js';

// Ordre d'affichage des groupes
export const GROUPS = ['Suites logiques', 'Raisonnement verbal', 'Raisonnement spatial', 'Compréhension mécanique', 'Attention', 'Mémoire', 'Calcul', 'Multitâche', 'Psychomotricité', 'Instruments', 'Conscience de la situation', 'Structuration d’informations'];

// Formats d'examen blanc. ⚠️ Ce sont des SIMULATIONS : la durée et le nombre exacts de
// questions des épreuves officielles ne sont pas publiés (voir docs/selection-eopn.md).
export const EXAMS = [
  {
    id: 'tamic',
    title: 'Batterie type TAMI-C',
    desc: 'Raisonnement, verbal, spatial, arithmétique, attention, codage — format simulé.',
    sections: [
      { title: 'Raisonnement logique', gens: ['psy.suites-nombres', 'psy.suites-lettres', 'psy.matrices', 'psy.dominos'], count: 10, time: 8 * 60 },
      { title: 'Raisonnement verbal', gens: ['psy.verbal'], count: 10, time: 4 * 60 },
      { title: 'Raisonnement spatial', gens: ['psy.rotations', 'psy.cubes'], count: 8, time: 6 * 60 },
      { title: 'Arithmétique', gens: ['psy.calcul', 'psy.problemes'], count: 12, time: 8 * 60 },
      { title: 'Attention et codage', gens: ['psy.codage', 'psy.comptage'], count: 12, time: 5 * 60 },
    ],
  },
  {
    id: 'navigant',
    title: 'Tests spécifiques navigants',
    desc: 'Instruments, orientation, problèmes, mémoire, multitâche — format simulé.',
    sections: [
      { title: 'Lecture d’instruments', gens: ['psy.instruments', 'psy.horizon'], count: 15, time: 6 * 60 },
      { title: 'Orientation et caps', gens: ['psy.caps', 'psy.horizon', 'psy.vor'], count: 10, time: 5 * 60 },
      { title: 'Conscience de la situation', gens: ['psy.vor', 'psy.vent', 'psy.circuit', 'psy.papi', 'psy.attitudes', 'psy.trafic', 'psy.orientation', 'psy.navaig', 'psy.attente', 'psy.signaux', 'psy.interception', 'psy.urgences'], count: 16, time: 7 * 60 },
      { title: 'Problèmes arithmétiques', gens: ['psy.problemes'], count: 10, time: 10 * 60 },
      { title: 'Structuration d’informations', gens: ['psy.structuration'], count: 8, time: 6 * 60 },
      { title: 'Mémoire', gens: ['psy.memoire-chiffres', 'psy.memoire-images'], count: 6, time: 4 * 60 },
      { title: 'Multitâche', gens: ['psy.multitache'], count: 1, time: 90 },
      { title: 'Manche et palonniers', gens: ['psy.manche'], count: 1, time: 150 },
    ],
  },
  {
    id: 'pilote',
    title: 'Batterie type sélection pilote',
    desc: 'Tests inspirés des sélections pilotes (DLR, Air France, ENAC) : angles, cadrans, N-back, mémoire défilante, compteurs, réaction. Format d’entraînement.',
    sections: [
      { title: 'Estimation d’angles', gens: ['psy.angles'], count: 12, time: 2 * 60 },
      { title: 'Surveillance de cadrans', gens: ['psy.cadrans'], count: 10, time: 90 },
      { title: 'N-back', gens: ['psy.nback'], count: 1, time: 2 * 60 },
      { title: 'Mémoire défilante', gens: ['psy.defilante'], count: 3, time: 2 * 60 },
      { title: 'Compteurs', gens: ['psy.compteurs'], count: 2, time: 2 * 60 },
      { title: 'Réaction à des signaux', gens: ['psy.reaction'], count: 1, time: 90 },
    ],
  },
  {
    id: 'express',
    title: 'Examen express (≈ 12 min)',
    desc: 'Un peu de tout pour un entraînement quotidien rapide.',
    sections: [
      {
        title: 'Mélange',
        gens: ['psy.suites-nombres', 'psy.matrices', 'psy.rotations', 'psy.cubes', 'psy.mecanique', 'psy.calcul', 'psy.problemes', 'psy.codage', 'psy.instruments', 'psy.horizon', 'psy.caps'],
        count: 20,
        time: 12 * 60,
      },
    ],
  },
];
