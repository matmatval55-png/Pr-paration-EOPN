// English module: grammar, vocabulary, ICAO phraseology & alphabet, reading, flashcards, test-style exams.
import { registerBank } from '../core/bank.js';
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { addExams } from '../exams.js';
import { GRAMMAR } from './grammar.js';
import { GENERAL, PHRASEO, AERO, AERO_ITEMS } from './vocab.js';
import { READING } from './reading.js';
import './atc.js';

const M = 'anglais';

export const ICAO = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];
const DIGITS = ['ZE-RO', 'WUN', 'TOO', 'TREE', 'FOW-ER', 'FIFE', 'SIX', 'SEV-EN', 'AIT', 'NIN-ER'];
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

registerBank({ id: 'en.grammar', module: M, group: 'Grammar', title: 'Grammar', desc: 'Tenses, conditionals, passive, modals, inversion… (B1 → C1).', items: GRAMMAR, timeLimit: 30 });
registerBank({ id: 'en.vocab', module: M, group: 'Vocabulary', title: 'General vocabulary (C1)', desc: 'False friends, phrasal verbs, collocations, idioms.', items: GENERAL, timeLimit: 25 });
registerBank({ id: 'en.aero', module: M, group: 'Vocabulary', title: 'Aviation vocabulary', desc: 'Aircraft, airfield, flight, weather — French ↔ English.', items: AERO_ITEMS, timeLimit: 20 });
registerBank({ id: 'en.phraseo', module: M, group: 'Radiotelephony', title: 'ICAO phraseology', desc: 'Standard words, emergency, clearances, codes.', items: PHRASEO, timeLimit: 25 });
registerBank({ id: 'en.reading', module: M, group: 'Reading', title: 'Reading comprehension', desc: '7 texts (aviation, defence, space, daily life), 35 questions.', items: READING, timeLimit: 90 });

register({
  id: 'en.icao',
  module: M,
  group: 'Radiotelephony',
  title: 'ICAO alphabet & numbers',
  desc: 'Spelling alphabet, radio pronunciation of digits, callsigns.',
  make(level, r) {
    if (level === 1) {
      const i = r.int(0, 25);
      if (r.bool()) {
        const { choices, answer } = buildChoices(r, ICAO[i], r.shuffle(ICAO.filter((_, j) => j !== i)), 4);
        return { kind: 'mcq', layout: 'row', prompt: `ICAO spelling of the letter <b class="sym">${ABC[i]}</b>?`, choices, answer, explain: `<p>${ABC[i]} = <b>${ICAO[i]}</b>.</p><p class="small">${ICAO.map((w, j) => `${ABC[j]} ${w}`).join(' · ')}</p>`, timeLimit: 10 };
      }
      const { choices, answer } = buildChoices(r, ABC[i], r.shuffle(ABC.split('').filter((_, j) => j !== i)), 4);
      return { kind: 'mcq', layout: 'row', prompt: `Which letter is <b>${ICAO[i]}</b>?`, choices, answer, explain: `<p><b>${ICAO[i]}</b> = ${ABC[i]}.</p>`, timeLimit: 10 };
    }
    if (level === 2) {
      const d = r.int(0, 9);
      const { choices, answer } = buildChoices(r, DIGITS[d], r.shuffle(DIGITS.filter((_, j) => j !== d)), 4);
      return { kind: 'mcq', layout: 'row', prompt: `Radio pronunciation of the digit <b class="sym">${d}</b>?`, choices, answer, explain: `<p>${d} = <b>${DIGITS[d]}</b>.</p><p class="small">${DIGITS.map((w, j) => `${j} ${w}`).join(' · ')}</p><p class="tip">Numbers are spoken digit by digit: heading 270 = “two seven zero”; but FL 100 = “flight level one hundred”.</p>`, timeLimit: 12 };
    }
    const reg = 'F-' + Array.from({ length: 4 }, () => ABC[r.int(0, 25)]).join('');
    const spell = (s) => s.replace('-', '').split('').map((c) => ICAO[ABC.indexOf(c)]).join(' ');
    const good = spell(reg);
    const alter = () => {
      const w = good.split(' ');
      const p = r.int(0, w.length - 1);
      const idx = ICAO.indexOf(w[p]);
      w[p] = ICAO[(idx + r.int(1, 25)) % 26];
      return w.join(' ');
    };
    const { choices, answer } = buildChoices(r, good, [alter(), alter(), alter(), alter()], 4);
    return { kind: 'mcq', prompt: `How do you spell the registration <b>${reg}</b> on the radio?`, choices, answer, explain: `<p>${reg.replace('-', '').split('').map((c) => `${c} = ${ICAO[ABC.indexOf(c)]}`).join(' · ')}</p><p class="tip">French civil aircraft registrations start with F. After first contact, ATC may abbreviate the callsign (e.g. F-GABC → “Foxtrot Bravo Charlie”).</p>`, timeLimit: 25 };
  },
});

addExams([
  {
    id: 'en-mini',
    back: '#/anglais',
    title: 'English mini-test (40 q)',
    desc: 'Short test-style session: grammar, vocabulary, reading.',
    sections: [
      { title: 'Grammar', gens: ['en.grammar'], count: 15, time: 6 * 60 },
      { title: 'Vocabulary', gens: ['en.vocab', 'en.aero'], count: 15, time: 5 * 60 },
      { title: 'Reading', gens: ['en.reading'], count: 10, time: 6 * 60 },
    ],
  },
  {
    id: 'en-chambery',
    back: '#/anglais',
    title: 'Test type Chambéry (150 q, 55 min)',
    desc: 'Même rythme que le test officiel : 150 QCM en 55 min (≈ 22 s par question). Contenu simulé.',
    sections: [
      { title: 'Grammar', gens: ['en.grammar'], count: 48, time: 16 * 60 },
      { title: 'Vocabulary', gens: ['en.vocab', 'en.aero', 'en.phraseo'], count: 72, time: 22 * 60 },
      { title: 'Reading', gens: ['en.reading'], count: 30, time: 17 * 60 },
    ],
  },
]);

// Flashcards : [recto, verso]
export const DECKS = [
  { id: 'aero', title: 'Aviation vocabulary', cards: AERO.map(([fr, en]) => [fr, en]) },
  { id: 'icao', title: 'ICAO alphabet', cards: ICAO.map((w, i) => [ABC[i], w]).concat(DIGITS.map((w, i) => [String(i), w])) },
  {
    id: 'phraseo',
    title: 'Phraseology',
    cards: [
      ['ROGER', 'I have received all of your last transmission'], ['WILCO', 'I understand and will comply'], ['AFFIRM', 'Yes'], ['NEGATIVE', 'No / not correct / not granted'], ['SAY AGAIN', 'Repeat your last transmission'], ['STANDBY', 'Wait and I will call you'], ['UNABLE', 'I cannot comply'], ['DISREGARD', 'Ignore'], ['READ BACK', 'Repeat this message back to me'], ['MAYDAY', 'Distress (grave and imminent danger)'], ['PAN-PAN', 'Urgency'], ['7700', 'Emergency'], ['7600', 'Radio failure'], ['7500', 'Unlawful interference'], ['LINE UP AND WAIT', 'Enter the runway and wait (no take-off clearance)'], ['HOLD SHORT', 'Stop before the runway'], ['GO AROUND', 'Abort the approach and climb'], ['EXPEDITE', 'Do it as quickly as possible'], ['QNH', 'Pressure setting → altitude above sea level'], ['QFE', 'Pressure setting → height above the airfield'],
    ],
  },
  {
    id: 'faux-amis',
    title: 'False friends & phrasal verbs',
    cards: [
      ['actually', 'en fait'], ['eventually', 'finalement'], ['currently', 'actuellement'], ['sensible', 'raisonnable'], ['sensitive', 'sensible'], ['to attend', 'assister à'], ['to realise', 'se rendre compte'], ['library', 'bibliothèque'], ['to resume', 'reprendre'], ['demanding', 'exigeant'], ['to give up', 'abandonner'], ['to put off', 'reporter (une date)'], ['to call off', 'annuler'], ['to carry out', 'effectuer'], ['to come up with', 'trouver (une idée)'], ['to turn down', 'refuser'], ['to run out of', 'être à court de'], ['to cope with', 'faire face à'], ['to bring forward', 'avancer (une date)'], ['to overcome', 'surmonter'], ['commitment', 'engagement'], ['reliable', 'fiable'], ['thorough', 'minutieux'], ['hindsight', 'le recul (après coup)'], ['setback', 'revers, contretemps'],
    ],
  },
];
