// Preserve the original HTML; group top-level headings into readable sections.
export function enhanceSheet(article, { recall = true } = {}) {
  if (!article || article.dataset.enhanced) return;
  article.dataset.enhanced = '1';
  article.classList.add('revision-sheet');
  const nodes = [...article.childNodes];
  let section;
  for (const node of nodes) {
    if (!section || (node.nodeType === 1 && /^(H2|H3)$/.test(node.tagName))) {
      section = document.createElement('section');
      section.className = 'sheet-section';
      article.append(section);
    }
    section.append(node);
  }
  for (const p of article.querySelectorAll('.sheet-section > p')) {
    const t = p.textContent.trim();
    if (t.length < 100 && /^[^.!?]{1,30}\s*=/.test(t) && !t.includes(':')) p.classList.add('sheet-formula');
  }
  if (!recall) return;
  const tools = document.createElement('div');
  tools.className = 'sheet-tools';
  const button = document.createElement('button');
  button.className = 'btn';
  button.type = 'button';
  button.textContent = 'Masquer le cours · me tester';
  button.setAttribute('aria-expanded','true');
  const panel = document.createElement('div');
  panel.className = 'sheet-recall';
  panel.hidden = true;
  panel.innerHTML = '<h3>Restitution de mémoire</h3><p>Note les définitions, règles et méthodes dont tu te souviens, puis compare avec le cours.</p><textarea aria-label="Mes souvenirs du cours" placeholder="Sans regarder le cours…"></textarea>';
  tools.append(button);
  article.before(tools);
  article.after(panel);
  button.onclick = () => {
    const hide = !article.classList.contains('sheet-hidden');
    article.classList.toggle('sheet-hidden',hide);
    panel.hidden = !hide;
    button.setAttribute('aria-expanded',String(!hide));
    button.textContent = hide ? 'Afficher le cours · vérifier' : 'Masquer le cours · me tester';
  };
}
