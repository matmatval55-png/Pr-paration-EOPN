import { EXAM_BLOCK_MINUTES, EXAM_SUBJECTS, customExamId } from '../core/custom-exam.js';
import { el, esc } from '../core/ui.js';

export function renderCustomExam(root) {
  const form = el(`<form class="card">
    <h1>Composer un examen</h1>
    <p>Choisis au moins une matière. Chaque matière forme un bloc avec son propre chronomètre.</p>
    <fieldset>
      <legend>Matières</legend>
      ${EXAM_SUBJECTS.map(({ key, label }) => `<label class="check"><input type="checkbox" name="subject" value="${key}" ${key === 'psycho' ? 'checked' : ''}> ${esc(label)}</label>`).join('')}
    </fieldset>
    <div class="field"><label for="custom-minutes">Durée par bloc</label><select id="custom-minutes" name="minutes">
      ${EXAM_BLOCK_MINUTES.map((minute) => `<option value="${minute}">${minute} min</option>`).join('')}
    </select></div>
    <p data-duration aria-live="polite"></p>
    <button type="submit" class="btn primary block">Voir le programme</button>
    <a class="btn block" href="#/psycho">Retour aux examens</a>
  </form>`);
  root.replaceChildren(form);
  function selected() {
    const values = new FormData(form);
    return { subjects: values.getAll('subject'), minutes: Number(values.get('minutes')) };
  }
  function update() {
    const { subjects, minutes } = selected();
    form.querySelector('[data-duration]').textContent = subjects.length
      ? `${subjects.length} bloc(s) · ${minutes * subjects.length} minutes`
      : 'Choisis au moins une matière.';
    form.querySelector('button[type=submit]').disabled = !subjects.length;
  }
  form.onchange = update;
  form.onsubmit = (event) => {
    event.preventDefault();
    const { subjects, minutes } = selected();
    const id = customExamId(subjects, minutes);
    if (id) location.hash = '#/exam/' + id;
  };
  update();
}
