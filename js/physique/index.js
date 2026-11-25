import { registerChapters } from '../core/course.js';
import { CHAPTERS_PHYSIQUE } from './chapters.js';
import { fluides, ondes, thermodynamique } from './milieux.js';

export const CHAPTERS = registerChapters('physique', [...CHAPTERS_PHYSIQUE, fluides, ondes, thermodynamique]);
