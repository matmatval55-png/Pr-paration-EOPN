// Test de bout en bout dans Chromium (format téléphone) : parcourt toutes les pages,
// fait quelques questions de chaque exercice et vérifie l'absence d'erreurs JS.
// Usage : node tests/e2e.mjs [url]   (serveur local requis, ex. npx http-server -p 8080)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }
const { chromium, devices } = pw;

const BASE = process.argv[2] || 'http://localhost:8080/';
const SHOTS = process.env.SHOTS || '';
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: process.env.DARK ? 'dark' : 'light' });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()));
const shot = async (name) => SHOTS && (await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false }));

async function go(hash) {
  await page.goto(BASE + hash);
  await page.waitForTimeout(250);
}

// Répond à la question affichée (premier choix, ou saisie au pavé), puis passe à la suite.
async function answerOne() {
  if (await page.locator('.pre').count()) await page.waitForSelector('.qcard', { timeout: 15000 });
  await page.waitForSelector('.qcard, .summary', { timeout: 15000 });
  if (await page.locator('.summary').count()) return false;
  const choices = page.locator('.qcard .choice:not([disabled])');
  if (await choices.count()) await choices.first().click();
  else if (await page.locator('.qcard .keypad').count()) {
    await page.locator('.kp-grid button[data-k="4"]').click();
    await page.locator('.kp-grid button[data-k="2"]').click();
    await page.locator('.kp-ok').click();
  } else if (await page.locator('.barrage').count()) {
    await page.locator('.barrage button').nth(3).click();
    await page.locator('.qcard .btn.primary').click();
  } else if (await page.locator('.simon').count()) {
    await page.waitForSelector('.simon button:not([disabled])', { timeout: 15000 });
    for (let i = 0; i < 8 && (await page.locator('.simon button:not([disabled])').count()); i++) await page.locator('.simon button').nth(i % 9).click();
  } else if (await page.locator('.mt').count()) {
    return 'skip';
  }
  await page.waitForSelector('.feedback, .summary', { timeout: 70000 });
  return true;
}

// 1. Pages principales
for (const h of ['', '#/psycho', '#/maths', '#/stats', '#/plus', '#/selection', '#/revision']) {
  await go(h);
  await shot('page-' + (h.replace(/[#/]/g, '') || 'home'));
}

// 2. Chaque générateur psycho : 3 questions
const gens = await page.evaluate(async () => (await import('./js/core/registry.js')).listGens().map((g) => g.id));
console.log('générateurs :', gens.length);
for (const id of gens) {
  if (id === 'psy.multitache') continue;
  await go('#/train/' + id);
  await page.locator('.seg[data-name="chrono"] button[data-v="0"]').click();
  await page.locator('[data-start]').click();
  for (let i = 0; i < 3; i++) {
    const r = await answerOne();
    if (r !== true) break;
    if (i === 0) await shot('q-' + id);
    await page.locator('.fb-next').click();
  }
  await page.locator('.quiz-quit').click().catch(() => {});
  page.once('dialog', (d) => d.accept());
}
page.on('dialog', (d) => d.accept());

// 3. Multitâche : lancement court
await go('#/train/psy.multitache');
await page.locator('[data-start]').click();
await page.waitForSelector('.mt');
await page.mouse.move(200, 300);
await page.waitForTimeout(1500);
await shot('q-multitache');
await page.locator('.quiz-quit').click();

// 4. Chapitre de maths : onglets + série progressive complète
await go('#/maths/fractions');
await shot('maths-cours');
await page.locator('.tabs button[data-t="exos"]').click();
await page.locator('[data-mode="prog"]').click();
await page.locator('[data-start]').click();
for (let i = 0; i < 10; i++) {
  await answerOne();
  await page.locator('.fb-next').click();
}
await page.waitForSelector('.summary');
await shot('maths-bilan');

// 5. Examen express complet (20 questions)
await go('#/exam/express');
await page.locator('[data-start]').click();
await page.locator('[data-go]').click();
for (let i = 0; i < 20; i++) {
  await page.waitForSelector('.qcard', { timeout: 15000 });
  const c = page.locator('.qcard .choice:not([disabled])');
  if (await c.count()) await c.first().click();
  else {
    await page.locator('.kp-grid button[data-k="1"]').click();
    await page.locator('.kp-ok').click();
  }
  await page.waitForTimeout(60);
}
await page.waitForSelector('.summary', { timeout: 10000 });
await shot('exam-result');

// 6. Révisions + tableau de bord avec données
await go('#/revision');
await shot('revision');
await go('#/stats');
await shot('stats-data');
await go('');
await shot('home-data');

// 7. Débordement horizontal (la page ne doit jamais défiler en largeur)
for (const h of ['', '#/psycho', '#/maths/trigo', '#/stats', '#/selection']) {
  await go(h);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (over > 1) errors.push(`débordement horizontal de ${over}px sur ${h || 'accueil'}`);
}

// 8. Hors ligne (après installation du service worker)
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload();
await page.waitForTimeout(500);
await ctx.setOffline(true);
await go('#/maths/probas');
const offlineOk = await page.locator('h1').innerText().catch(() => '');
if (!/Probabilités/.test(offlineOk)) errors.push('hors ligne : la page ne se charge pas');
await ctx.setOffline(false);

await browser.close();
if (errors.length) {
  console.error('ERREURS :\n' + [...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log('E2E OK');
