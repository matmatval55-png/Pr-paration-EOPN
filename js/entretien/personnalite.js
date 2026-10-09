// Questionnaire de personnalité d'ENTRAÎNEMENT (non validé scientifiquement, ce n'est pas le test officiel).
// But : se familiariser avec ce type de questionnaire, mieux se connaître, vérifier sa cohérence
// et préparer l'entretien avec l'officier psychologue, qui s'appuie sur ces résultats.

export const DIMENSIONS = {
  stab: { label: 'Stabilité émotionnelle', desc: 'Gestion du stress, calme, récupération après un échec.' },
  rig: { label: 'Rigueur et organisation', desc: 'Méthode, respect des règles et des procédures, fiabilité.' },
  soc: { label: 'Aisance relationnelle', desc: 'Aller vers les autres, s’exprimer en groupe.' },
  coop: { label: 'Esprit d’équipe', desc: 'Entraide, acceptation des décisions collectives et des critiques.' },
  ouv: { label: 'Ouverture et adaptabilité', desc: 'Curiosité, adaptation aux imprévus et au changement.' },
  lead: { label: 'Leadership et décision', desc: 'Initiative, prise de décision, aisance à diriger.' },
};

// [id, dimension, sens (+1 direct / -1 inversé), texte]
const RAW = [
  ['s1', 'stab', 1, 'Je reste calme quand les choses ne se passent pas comme prévu.'],
  ['s2', 'stab', 1, 'Je récupère vite après un échec.'],
  ['s3', 'stab', 1, 'Sous pression, je garde les idées claires.'],
  ['s4', 'stab', 1, 'Je dors bien, même la veille d’un examen important.'],
  ['s5', 'stab', -1, 'Je m’inquiète souvent pour des choses sans grande importance.'],
  ['s6', 'stab', -1, 'Une critique peut me perturber pendant plusieurs jours.'],
  ['s7', 'stab', -1, 'Je m’énerve facilement quand on me contrarie.'],
  ['s8', 'stab', -1, 'Mon humeur change souvent au cours d’une même journée.'],
  ['r1', 'rig', 1, 'Je planifie mon travail à l’avance.'],
  ['r2', 'rig', 1, 'Je vérifie mon travail avant de le rendre.'],
  ['r3', 'rig', 1, 'Je respecte les règles même quand personne ne contrôle.'],
  ['r4', 'rig', 1, 'Je termine ce que je commence.'],
  ['r5', 'rig', -1, 'Je remets souvent à plus tard ce que je dois faire.'],
  ['r6', 'rig', -1, 'Mes affaires sont souvent en désordre.'],
  ['r7', 'rig', -1, 'Il m’arrive d’oublier des rendez-vous ou des échéances.'],
  ['r8', 'rig', -1, 'Je trouve les procédures et les check-lists inutiles quand on connaît son travail.'],
  ['o1', 'soc', 1, 'Je vais facilement vers des personnes que je ne connais pas.'],
  ['o2', 'soc', 1, 'Je me sens à l’aise pour parler devant un groupe.'],
  ['o3', 'soc', 1, 'J’aime les activités en groupe.'],
  ['o4', 'soc', 1, 'J’engage facilement la conversation.'],
  ['o5', 'soc', -1, 'Je préfère rester seul la plupart du temps.'],
  ['o6', 'soc', -1, 'Je suis mal à l’aise dans une pièce pleine d’inconnus.'],
  ['o7', 'soc', -1, 'Je parle peu en réunion, même quand j’ai une idée.'],
  ['o8', 'soc', -1, 'Les longues soirées entre amis me fatiguent vite.'],
  ['c1', 'coop', 1, 'J’aide spontanément un camarade en difficulté.'],
  ['c2', 'coop', 1, 'J’accepte facilement une décision collective qui n’est pas la mienne.'],
  ['c3', 'coop', 1, 'Je fais confiance aux autres a priori.'],
  ['c4', 'coop', 1, 'Je reconnais facilement mes erreurs devant les autres.'],
  ['c5', 'coop', -1, 'Je préfère travailler seul pour que ce soit bien fait.'],
  ['c6', 'coop', -1, 'J’ai du mal à accepter les remarques des autres.'],
  ['c7', 'coop', -1, 'Dans un désaccord, j’ai besoin d’avoir le dernier mot.'],
  ['c8', 'coop', -1, 'Le succès du groupe m’importe moins que mon succès personnel.'],
  ['u1', 'ouv', 1, 'J’aime apprendre des choses nouvelles, même loin de mes études.'],
  ['u2', 'ouv', 1, 'Je m’adapte vite à un changement d’organisation.'],
  ['u3', 'ouv', 1, 'Je m’intéresse à l’actualité internationale.'],
  ['u4', 'ouv', 1, 'J’aime découvrir d’autres cultures et d’autres façons de faire.'],
  ['u5', 'ouv', -1, 'Je préfère mes habitudes aux nouveautés.'],
  ['u6', 'ouv', -1, 'Un imprévu dans mon planning me déstabilise beaucoup.'],
  ['u7', 'ouv', -1, 'Je n’aime pas qu’on remette en cause ma façon de faire.'],
  ['u8', 'ouv', -1, 'Les sujets abstraits m’ennuient.'],
  ['l1', 'lead', 1, 'Dans un groupe, je prends naturellement des initiatives.'],
  ['l2', 'lead', 1, 'Je sais prendre une décision rapidement quand il le faut.'],
  ['l3', 'lead', 1, 'J’aime avoir des responsabilités.'],
  ['l4', 'lead', 1, 'Je sais dire non quand c’est nécessaire.'],
  ['l5', 'lead', -1, 'J’attends qu’on me dise quoi faire.'],
  ['l6', 'lead', -1, 'J’évite de prendre des décisions qui engagent les autres.'],
  ['l7', 'lead', -1, 'Je suis mal à l’aise quand je dois donner des consignes.'],
  ['l8', 'lead', -1, 'Je préfère suivre plutôt que diriger.'],
  // Désirabilité sociale : personne ne peut honnêtement être « tout à fait d'accord » avec ces phrases.
  ['d1', 'desir', 1, 'Je n’ai jamais menti, même pour une petite chose.'],
  ['d2', 'desir', 1, 'Je ne me suis jamais mis en colère contre quelqu’un.'],
  ['d3', 'desir', 1, 'Je suis toujours d’humeur égale, sans exception.'],
  ['d4', 'desir', 1, 'Je n’ai jamais été jaloux de la réussite de quelqu’un.'],
  ['d5', 'desir', 1, 'Je n’ai jamais remis à plus tard une tâche ennuyeuse.'],
  ['d6', 'desir', 1, 'Je n’ai jamais dit du mal de quelqu’un dans son dos.'],
  // Contrôle de cohérence : reformulations d'items déjà posés.
  ['k1', 'ctrl', 1, 'Je garde mon sang-froid dans les situations difficiles.'],
  ['k2', 'ctrl', 1, 'J’ai tendance à repousser mes tâches au dernier moment.'],
  ['k3', 'ctrl', 1, 'Je prends facilement la parole en public.'],
  ['k4', 'ctrl', 1, 'Quand on me fait une remarque, je l’accepte sans difficulté.'],
  ['k5', 'ctrl', 1, 'Les changements de dernière minute ne me gênent pas.'],
  ['k6', 'ctrl', 1, 'Je prends volontiers la tête d’un groupe.'],
];

// Paires de cohérence : [item contrôle, item d'origine, même sens (true) ou sens opposé (false)]
export const PAIRS = [['k1', 's3', true], ['k2', 'r5', true], ['k3', 'o2', true], ['k4', 'c6', false], ['k5', 'u6', false], ['k6', 'l8', false]];

// Ordre fixe et mélangé (les reformulations sont éloignées de leur item d'origine).
function shuffled(arr, seed = 7) {
  const a = arr.slice();
  let x = seed;
  for (let i = a.length - 1; i > 0; i--) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const j = x % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const ITEMS = shuffled(RAW.map(([id, dim, dir, txt]) => ({ id, dim, dir, txt })));
export const SCALE = ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Ni l’un ni l’autre', 'Plutôt d’accord', 'Tout à fait d’accord'];

export function score(answers) {
  const byId = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
  const dims = {};
  for (const k of Object.keys(DIMENSIONS)) {
    const its = ITEMS.filter((i) => i.dim === k && answers[i.id]);
    const avg = its.length ? its.reduce((a, i) => a + (i.dir > 0 ? answers[i.id] : 6 - answers[i.id]), 0) / its.length : null;
    dims[k] = avg == null ? null : Math.round(((avg - 1) / 4) * 100);
  }
  const des = ITEMS.filter((i) => i.dim === 'desir' && answers[i.id]);
  const desir = des.length ? des.reduce((a, i) => a + answers[i.id], 0) / des.length : null;
  const gaps = PAIRS.filter(([a, b]) => answers[a] && answers[b]).map(([a, b, same]) => {
    const va = answers[a];
    const vb = same ? answers[b] : 6 - answers[b];
    return { a: byId[a], b: byId[b], same, gap: Math.abs(va - vb) };
  });
  const incoh = gaps.filter((g) => g.gap >= 2);
  const meanGap = gaps.length ? gaps.reduce((s, g) => s + g.gap, 0) / gaps.length : 0;
  return { dims, desir, incoh, meanGap };
}

// Questions qu'un psychologue pourrait poser selon le profil (haut / bas).
export const QUESTIONS_PSY = {
  stab: { haut: ['Racontez une situation où vous avez été très stressé. Qu’avez-vous ressenti, et fait ?', 'Qu’est-ce qui pourrait vous faire perdre vos moyens ?'], bas: ['Comment gérez-vous votre stress au quotidien ?', 'Comment réagiriez-vous à un échec en école de pilotage ?'] },
  rig: { haut: ['Être très organisé peut rendre rigide : comment réagissez-vous quand un plan tombe à l’eau ?', 'Donnez un exemple de règle que vous avez respectée alors que ça vous coûtait.'], bas: ['Comment allez-vous suivre un rythme de formation très exigeant ?', 'Parlez-moi d’une fois où un oubli a eu des conséquences.'] },
  soc: { haut: ['Savez-vous aussi écouter ? Donnez un exemple.', 'Comment vivez-vous les moments seul, par exemple en détachement loin de vos proches ?'], bas: ['Comment allez-vous vivre la vie en collectivité à l’école ?', 'Comment faites-vous pour vous intégrer dans un nouveau groupe ?'] },
  coop: { haut: ['Vous arrive-t-il de vous effacer trop ? Savez-vous défendre votre avis ?', 'Comment réagissez-vous si un équipier ne fait pas sa part ?'], bas: ['Un pilote travaille en équipage : comment voyez-vous cela ?', 'Racontez un désaccord avec quelqu’un et comment il s’est terminé.'] },
  ouv: { haut: ['La vie militaire est très cadrée : comment le vivrez-vous ?', 'Comment choisissez-vous entre nouveauté et procédure établie ?'], bas: ['Comment réagiriez-vous à une mutation imposée dans une région que vous ne connaissez pas ?', 'Qu’avez-vous appris récemment en dehors de vos études ?'] },
  lead: { haut: ['Êtes-vous capable d’obéir à un ordre avec lequel vous n’êtes pas d’accord ?', 'Donnez un exemple où vous avez dû laisser quelqu’un d’autre diriger.'], bas: ['Un officier commande : comment vous voyez-vous dans ce rôle ?', 'Racontez une décision difficile que vous avez prise seul.'] },
};

export const METHODE_PSY = `
  <p>Pendant la sélection, tu passes des <b>questionnaires de personnalité</b> et un <b>entretien avec un officier psychologue</b> (confirmé : jury de 2 navigants et un officier psychologue du CERP’Air). Le psychologue a tes résultats sous les yeux : l’entretien sert souvent à <b>les vérifier et les approfondir</b>.</p>
  <h3>Les règles d’or du questionnaire</h3>
  <ul><li><b>Il n’y a pas de bon profil.</b> On cherche une personnalité compatible avec le métier et stable, pas un « super-héros ».</li><li><b>Réponds spontanément</b> : la première réponse est souvent la plus juste. Ne cherche pas à deviner ce qu’on attend.</li><li><b>Sois cohérent</b> : les questionnaires reposent plusieurs fois la même question avec d’autres mots. Des réponses contradictoires se voient.</li><li><b>Évite de te montrer parfait</b> : des phrases comme « je n’ai jamais menti » servent à repérer ceux qui embellissent. Les cocher « tout à fait d’accord » nuit à ta crédibilité.</li><li><b>Évite les extrêmes systématiques</b> (toujours 1 ou 5) comme le « ni l’un ni l’autre » partout.</li></ul>
  <h3>L’entretien avec le psychologue</h3>
  <ul><li>Thèmes fréquents : ton parcours, ta famille, ta motivation profonde, ta gestion du stress et des échecs, ta vie en collectivité, tes relations, ton projet en cas d’échec.</li><li>Prépare des <b>exemples concrets</b> (méthode STAR : situation, tâche, action, résultat) pour chacun de tes traits marquants.</li><li>Reste <b>authentique</b> : le psychologue est formé pour repérer un discours appris par cœur.</li><li>Parler d’un défaut ou d’un échec n’est pas éliminatoire : ce qui compte, c’est ce que tu en as tiré.</li></ul>
  <p class="tip">Le questionnaire de ce site est un outil d’entraînement et de réflexion personnelle. Il n’est pas validé scientifiquement et ne reproduit pas le test officiel.</p>`;
