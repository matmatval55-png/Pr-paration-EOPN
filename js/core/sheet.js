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
  const sections = [...article.querySelectorAll(':scope > .sheet-section')].filter(s => s.textContent.trim() || s.querySelector('svg,img'));
  const nav = document.createElement('div');
  nav.className = 'notebook-nav';
  nav.innerHTML = '<div class="notebook-top"><span>CARNET DE RÉVISION</span><button type="button" class="btn" data-all>Tout afficher</button></div><div class="notebook-progress" role="status"></div><div class="notebook-controls"><button type="button" class="btn" data-prev>← Précédent</button><button type="button" class="btn" data-next>Suivant →</button></div>';
  article.prepend(nav);
  let index = 0, all = false;
  const paint = () => {
    sections.forEach((s,i) => { s.hidden = !all && i !== index; });
    nav.querySelector('.notebook-progress').textContent = all ? sections.length+' notions · fiche complète' : 'Notion '+(index+1)+' / '+sections.length;
    nav.querySelector('[data-prev]').disabled = all || index===0;
    nav.querySelector('[data-next]').disabled = all || index>=sections.length-1;
    nav.querySelector('[data-all]').textContent = all ? 'Notion par notion' : 'Tout afficher';
  };
  nav.querySelector('[data-prev]').onclick = () => { if(index>0)index--;paint(); };
  nav.querySelector('[data-next]').onclick = () => { if(index<sections.length-1)index++;paint(); };
  nav.querySelector('[data-all]').onclick = () => { all=!all;paint(); };
  for (const [i,s] of sections.entries()) {
    const heading = s.querySelector('h2,h3');
    const label = document.createElement('div');
    label.className = 'notebook-label';
    label.textContent = 'NOTION '+String(i+1).padStart(2,'0');
    s.prepend(label);
    const terms = [...s.querySelectorAll('b,strong')].filter(t => t.textContent.trim().length>=3 && t.textContent.trim().length<=65 && !t.closest('svg,table,.ex,.tip'));
    if(terms.length) {
      const check = document.createElement('button');
      check.type='button';check.className='notebook-memory';
      check.textContent='Masquer les mots clés';
      check.setAttribute('aria-pressed','false');
      check.onclick=()=>{const hide=s.classList.toggle('notebook-mask');check.textContent=hide?'Révéler les mots clés':'Masquer les mots clés';check.setAttribute('aria-pressed',String(hide));};
      terms.forEach(t=>t.classList.add('notebook-key'));
      s.append(check);
    }
  }
  if(sections.length) paint(); else nav.remove();
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
