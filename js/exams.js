// Tous les examens blancs de l'application (psychotechniques, anglais, culture…).
import { EXAMS as PSYCHO } from './psycho/index.js';

export const EXAMS = [...PSYCHO.map((e) => ({ back: '#/psycho', ...e }))];

export function addExams(list) {
  for (const e of list) if (!EXAMS.some((x) => x.id === e.id)) EXAMS.push(e);
}
