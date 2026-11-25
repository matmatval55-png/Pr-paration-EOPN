import { store } from './store.js';

export const CARD_SUBJECTS = {
  psycho: 'Psychotechniques', maths: 'Mathématiques', physique: 'Physique',
  anglais: 'Anglais', culture: 'Culture aéronautique',
};

export function personalDecks() {
  return Object.entries(CARD_SUBJECTS).flatMap(([module, name]) => {
    const cards = store.data.personalCards[module];
    return cards?.length ? [{ id: `perso-${module}`, title: name + ' · cartes personnelles', cards }] : [];
  });
}

export function addPersonalCard(module, front, back) {
  if (!Object.hasOwn(CARD_SUBJECTS, module)) return false;
  const card = [front.trim(), back.trim()];
  if (card.some((side) => !side || side.length > 2000)) return false;
  const existing = store.data.personalCards[module] || [];
  if (existing.some(([a, b]) => a === card[0] && b === card[1])) return false;
  store.update((s) => { (s.personalCards[module] ||= []).push(card); });
  return true;
}
