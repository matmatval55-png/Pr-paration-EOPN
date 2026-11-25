// Le format est encodé dans son identifiant pour préserver l’historique et la comparabilité.
const SUBJECTS = {
  psycho: ['Psychotechniques', ['psy.suites-nombres', 'psy.matrices', 'psy.rotations', 'psy.cubes']],
  maths: ['Mathématiques', ['maths.fractions', 'maths.proportionnalite', 'maths.trigo', 'maths.equations']],
  physique: ['Physique', ['physique.cinematique', 'physique.forces', 'physique.fluides', 'physique.ondes']],
  anglais: ['Anglais', ['en.grammar', 'en.vocab', 'en.reading', 'en.phraseo']],
  navigation: ['Instruments et navigation', ['psy.instruments', 'psy.horizon', 'psy.vent', 'psy.vor']],
  culture: ['Culture aéronautique', ['bia.aero', 'bia.aeronefs', 'bia.meteo', 'bia.navreg']],
};

export const EXAM_SUBJECTS = Object.entries(SUBJECTS).map(([key, [label]]) => ({ key, label }));
export const EXAM_BLOCK_MINUTES = [10, 15, 20];

export function customExamId(subjects, minutes) {
  const keys = EXAM_SUBJECTS.map(({ key }) => key).filter((key) => subjects.includes(key));
  if (!keys.length || !EXAM_BLOCK_MINUTES.includes(minutes)) return null;
  return `perso-v1-${minutes}-${keys.join('_')}`;
}

export function customExam(id) {
  const match = /^perso-v1-(\d+)-([a-z_]+)$/.exec(id);
  if (!match) return null;
  const minutes = Number(match[1]);
  const subjects = match[2].split('_');
  if (customExamId(subjects, minutes) !== id) return null;
  const count = { 10: 12, 15: 16, 20: 20 }[minutes];
  return {
    id, title: `Examen personnalisé (${minutes * subjects.length} min)`, fixedComposition: true,
    desc: 'Simulation non officielle. Chaque bloc garde la même durée et les mêmes quotas à chaque passage.',
    back: '#/exam/personnaliser',
    sections: subjects.map((key) => {
      const [title, gens] = SUBJECTS[key];
      return { title, gens, time: minutes * 60, count };
    }),
  };
}
