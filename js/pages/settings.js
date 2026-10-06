import { store } from '../core/store.js';
import { toast, el } from '../core/ui.js';
import { applyTheme } from '../theme.js';
import { MODULES } from './modules.js';

let deferredPrompt = null;
addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

export function renderSettings(root) {
  const s = store.data.settings;
  root.innerHTML = '';
  const page = el(`
    <div>
      <h1>Réglages</h1>
      ${store.storageOk ? '' : '<div class="card" style="border-color:var(--danger)">⚠️ Le stockage local est indisponible (navigation privée ?). Tes progrès ne seront pas conservés : pense à exporter tes données.</div>'}
      <div class="card">
        <h3>Ma sélection</h3>
        <div class="field"><label for="date">Date de la sélection (approximative)</label><input type="date" id="date" value="${s.selectionDate || ''}"></div>
        <div class="field"><label for="hours">Heures disponibles par semaine</label><input type="number" id="hours" min="1" max="30" step="0.5" value="${s.hoursPerWeek}"></div>
        <div class="field"><label>Barème sportif</label><div class="seg" data-k="sex"><button data-v="H" class="${s.sex === 'H' ? 'on' : ''}">Hommes</button><button data-v="F" class="${s.sex === 'F' ? 'on' : ''}">Femmes</button></div></div>
      </div>
      <div class="card">
        <h3>Apparence</h3>
        <div class="seg" data-k="theme"><button data-v="auto" class="${s.theme === 'auto' ? 'on' : ''}">Auto</button><button data-v="light" class="${s.theme === 'light' ? 'on' : ''}">Clair</button><button data-v="dark" class="${s.theme === 'dark' ? 'on' : ''}">Sombre</button></div>
      </div>
      <div class="card">
        <h3>Sauvegarde</h3>
        <p class="small muted">Tes données restent sur ce téléphone (stockage local). Exporte-les régulièrement en fichier JSON pour ne rien perdre (changement de téléphone, nettoyage du navigateur…).</p>
        <div class="btn-row"><button class="btn" data-export>⬇️ Exporter</button><label class="btn">⬆️ Importer<input type="file" accept="application/json,.json" data-import hidden></label></div>
        <button class="btn block danger" data-reset>Tout effacer</button>
      </div>
      <div class="card" data-install-card ${deferredPrompt ? '' : 'hidden'}>
        <h3>Installer l’application</h3>
        <button class="btn primary block" data-install>📲 Installer sur l’écran d’accueil</button>
      </div>
      <div class="card small">
        <h3>Installer sur iPhone</h3>
        <p>Dans Safari : bouton Partager → « Sur l’écran d’accueil ». Sur Android (Chrome) : menu ⋮ → « Installer l’application ». Une fois installée, l’application fonctionne hors ligne.</p>
      </div>
      <h2>Tous les modules</h2>
      <div class="list">${MODULES.map((m) => `<a class="row-link" href="${m.href}"><span>${m.ico}</span><span class="grow"><span class="title">${m.title}</span><br><span class="sub">${m.sub}</span></span><span class="chev">›</span></a>`).join('')}
        <a class="row-link" href="#/selection"><span>ℹ️</span><span class="grow"><span class="title">La sélection EOPN (sources)</span></span><span class="chev">›</span></a>
      </div>
      <p class="small muted center">Prépa EOPN · application personnelle de révision, non officielle.</p>
    </div>`);
  root.append(page);

  page.querySelector('#date').onchange = (e) => store.update((d) => (d.settings.selectionDate = e.target.value));
  page.querySelector('#hours').onchange = (e) => store.update((d) => (d.settings.hoursPerWeek = Math.max(1, Math.min(30, Number(e.target.value) || 6))));
  page.querySelectorAll('.seg[data-k]').forEach((sg) =>
    sg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      sg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      store.update((d) => (d.settings[sg.dataset.k] = b.dataset.v));
      if (sg.dataset.k === 'theme') applyTheme();
    }),
  );
  page.querySelector('[data-export]').onclick = () => {
    const blob = new Blob([store.exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `prepa-eopn-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a);
    a.click();
    setTimeout(() => (URL.revokeObjectURL(a.href), a.remove()), 1000);
    toast('Sauvegarde exportée');
  };
  page.querySelector('[data-import]').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      store.importJSON(await f.text());
      applyTheme();
      toast('Sauvegarde importée ✓');
      renderSettings(root);
    } catch (err) {
      toast(err.message || 'Fichier invalide');
    }
  };
  page.querySelector('[data-reset]').onclick = () => {
    if (confirm('Effacer toutes tes données (statistiques, révisions, réglages) ? Exporte-les avant si besoin.')) {
      store.reset();
      applyTheme();
      toast('Données effacées');
      renderSettings(root);
    }
  };
  const inst = page.querySelector('[data-install]');
  inst.onclick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    page.querySelector('[data-install-card]').hidden = true;
  };
}
