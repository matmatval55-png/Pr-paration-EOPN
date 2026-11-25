import { CARD_SUBJECTS, addPersonalCard } from '../core/personal-cards.js';
import { CAUSES, classifyMistake, mistakeEntries } from '../core/mistakes.js';
import { getGen } from '../core/registry.js';
import { runQuiz, summaryHTML } from '../core/quiz.js';
import { el, esc, fmtMs } from '../core/ui.js';

export function renderMistakes(root) {
  let module = '';
  let cause = '';
  let limit = 25;
  const draw = () => {
    const entries = mistakeEntries({ module, cause });
    const page = el(`<div>
      <h1>Carnet d’erreurs</h1>
      <p class="muted">Les erreurs enregistrées sur cet appareil sont classées par fréquence. Tu peux indiquer toi-même la cause.</p>
      <div class="card">
        <div class="field"><label for="mistake-module">Matière</label><select id="mistake-module">
          <option value="">Toutes</option><option value="psycho">Psychotechniques</option><option value="maths">Mathématiques</option><option value="physique">Physique</option><option value="anglais">Anglais</option><option value="culture">Culture</option>
        </select></div>
        <div class="field"><label for="mistake-cause">Cause</label><select id="mistake-cause"><option value="">Toutes</option>${CAUSES.map((name) => `<option>${esc(name)}</option>`).join('')}</select></div>
        ${entries.some(([, item]) => getGen(item.spec.gen) && !getGen(item.spec.gen).noSrs) ? '<button class="btn primary" data-retry>Revoir les erreurs les plus fréquentes</button>' : ''}
      </div>
      ${entries.length ? '' : '<p>Aucune erreur pour ces filtres.</p>'}
      ${entries.slice(0, limit).map(([key, e], index) => `<details class="card">
        <summary><strong>${esc(getGen(e.spec.gen)?.title || e.spec.gen)}</strong> · niveau ${e.spec.level} · ${e.count} erreur(s)</summary>
        <p>${esc(e.prompt)}</p>
        <p>Réponse donnée : ${e.timeout ? 'Temps écoulé' : esc(e.response || '—')}<br>Réponse attendue : ${esc(e.expected || 'Voir la correction')}</p>
        <p class="small muted">${new Date(e.ts).toLocaleDateString('fr-FR')} · ${fmtMs(e.ms)}</p>
        <p>${esc(e.correction)}</p>
        ${e.expected && Object.hasOwn(CARD_SUBJECTS, getGen(e.spec.gen)?.module) ? `<button class="btn" data-card="${index}" type="button">Créer une carte de révision</button>` : ''}

        <label for="mistake-${index}">Cause</label>
        <select id="mistake-${index}" data-entry="${esc(key)}"><option value="">Non classée</option>${CAUSES.map((name) => `<option ${name === e.cause ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select>
      </details>`).join('')}
      ${entries.length > limit ? '<button class="btn block" data-more>Afficher les erreurs suivantes</button>' : ''}
      <a class="btn block" href="#/revision">Révisions espacées</a>
    </div>`);
    root.replaceChildren(page);
    const moduleSelect = page.querySelector('#mistake-module');
    const causeSelect = page.querySelector('#mistake-cause');
    moduleSelect.value = module;
    causeSelect.value = cause;
    moduleSelect.onchange = () => { module = moduleSelect.value; limit = 25; draw(); };
    causeSelect.onchange = () => { cause = causeSelect.value; limit = 25; draw(); };
    page.querySelectorAll('[data-entry]').forEach((select) => {
      select.onchange = () => {
        classifyMistake(select.dataset.entry, select.value);
        if (cause) draw();
      };
    });
    page.querySelectorAll('[data-card]').forEach((button) => {
      button.onclick = () => {
        const [, item] = entries[Number(button.dataset.card)];
        const saved = addPersonalCard(getGen(item.spec.gen).module, item.prompt.slice(0, 2000), item.expected.slice(0, 2000));
        button.textContent = saved ? 'Carte enregistrée' : 'Carte déjà présente ou incomplète';
        button.disabled = true;
      };
    });
    page.querySelector('[data-more]')?.addEventListener('click', () => { limit += 25; draw(); });
    page.querySelector('[data-retry]')?.addEventListener('click', () => {
      const specs = entries.map(([, item]) => item.spec).filter((spec) => {
        const generator = getGen(spec.gen);
        return generator && !generator.noSrs;
      }).slice(0, 15);
      document.body.classList.add('in-quiz');
      runQuiz(root, {
        title: 'Révision du carnet', mode: 'review', total: specs.length,
        next: (i) => specs[i],
        onQuit() { document.body.classList.remove('in-quiz'); draw(); },
        onFinish(history) {
          document.body.classList.remove('in-quiz');
          root.replaceChildren(el(`<div>${summaryHTML(history, { title: 'Bilan de la révision' })}<a class="btn block" href="#/erreurs">Retour au carnet</a></div>`));
        },
      });
    });
  };
  draw();
}
