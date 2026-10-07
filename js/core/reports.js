// Signalement d'erreurs dans les questions + sauvegarde (export) partagée.
import { store } from './store.js';

const REPO = 'https://github.com/matmatval55-png/Pr-paration-EOPN';

export function plainText(html) {
  return String(html || '').replace(/<sup>(.*?)<\/sup>/g, '^$1').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function addReport(q, comment) {
  store.update((s) => {
    s.reports ||= [];
    s.reports.push({ ts: Date.now(), spec: q.spec, exercice: q.genTitle, question: plainText(q.prompt).slice(0, 400), comment: String(comment || '').slice(0, 600) });
  });
}

export function reportsText() {
  return (store.data.reports || [])
    .map((r, i) => `${i + 1}. [${r.exercice}] ${r.question}\n   Spec : ${r.spec?.gen} niveau ${r.spec?.level} graine ${r.spec?.seed}\n   Remarque : ${r.comment || '—'}`)
    .join('\n\n');
}

export function githubIssueUrl() {
  const body = `Signalements envoyés depuis l’application :\n\n${reportsText()}`.slice(0, 6000);
  return `${REPO}/issues/new?title=${encodeURIComponent('Erreurs signalées dans les questions')}&body=${encodeURIComponent(body)}`;
}

export function downloadBackup() {
  const blob = new Blob([store.exportJSON()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `prepa-eopn-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  setTimeout(() => (URL.revokeObjectURL(a.href), a.remove()), 1000);
  store.update((s) => (s.settings.lastExport = Date.now()));
}

// Faut-il rappeler d'exporter ? (au moins 30 réponses et aucun export depuis 7 jours)
export function backupDue() {
  const total = Object.values(store.data.days).reduce((a, d) => a + d.n, 0);
  const last = store.data.settings.lastExport || 0;
  return total >= 30 && Date.now() - last > 7 * 86400000;
}
