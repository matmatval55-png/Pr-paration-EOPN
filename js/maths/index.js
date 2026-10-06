import { registerChapters } from '../core/course.js';
import { calcul, fractions, puissances } from './ch-nombres.js';
import { equations, pourcentages, proportionnalite } from './ch-algebre.js';
import { fonctions, trigo, vecteurs, probas } from './ch-analyse.js';

// Ordre pédagogique : on consolide le calcul avant l'algèbre et l'analyse.
export const CHAPTERS = registerChapters('maths', [calcul, fractions, puissances, equations, pourcentages, proportionnalite, fonctions, trigo, vecteurs, probas]);
