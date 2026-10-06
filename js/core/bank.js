// Banques de questions à contenu fixe (anglais, culture, BIA…), branchées sur le même
// moteur que les générateurs : la « graine » d'une question = son numéro dans la banque,
// ce qui permet la révision espacée et les statistiques.
// Élément : { q: énoncé, a: bonne réponse, d: [mauvaises réponses], e: explication, l?: niveau 1-3, ctx?: texte support }
import { register } from './registry.js';

export function registerBank({ id, module, group, title, desc, items, timeLimit = 40, layout }) {
  const levels = Math.max(1, ...items.map((it) => it.l || 1));
  // niveau 0 = toute la banque (utilisé par les examens blancs)
  const pool = (level) => {
    if (!level) return items;
    const p = items.filter((it) => (it.l || 1) === level);
    return p.length ? p : items;
  };
  register({
    id,
    module,
    group,
    title,
    desc,
    levels,
    bank: true,
    bankSize: (level) => pool(level).length,
    make(level, r, spec) {
      const p = pool(level);
      const it = p[(spec?.seed ?? 0) % p.length];
      const choices = r.shuffle([it.a, ...it.d]);
      return {
        kind: 'mcq',
        layout: it.layout || layout,
        prompt: (it.ctx ? `<div class="passage">${it.ctx}</div>` : '') + it.q,
        choices,
        answer: choices.indexOf(it.a),
        explain: `<p>${it.e}</p>`,
        timeLimit: it.t || timeLimit,
      };
    },
  });
  return items.length;
}
