import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const base = process.argv[2] || 'http://localhost:8080/';

const browser = await chromium.launch(executablePath ? { executablePath } : {});
try {
  for (const device of ['iPhone 13', 'iPad (gen 7)']) {
    const context = await browser.newContext(devices[device]);
    const page = await context.newPage();
    await page.clock.install();
    await page.goto(base + '#/exam/instruments-intensif');
    await page.locator('[data-start]').tap();
    await page.locator('[data-go]').tap();
    await page.locator('.qcard').waitFor();
    await page.locator('.choice').first().tap();
    assert.equal(await page.locator('.feedback').count(), 0);
    await page.clock.fastForward(13 * 60 * 1000);
    await page.getByText('1/16 traitées').waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('eopn.v1')).exams[0].n), 16);
    await page.getByRole('button', { name: 'Refaire' }).tap();
    await page.locator('[data-start]').tap();
    await page.locator('[data-go]').tap();
    const correct = await page.evaluate(async () => {
      const { makeQuestion } = await import('./js/core/registry.js');
      const attempt = JSON.parse(sessionStorage.getItem('eopn.exam.checkpoint'));
      return makeQuestion(attempt.plans[0][0]).answer;
    });
    await page.locator('.choice').nth(correct).tap();
    await page.getByText('2 / 16', { exact: true }).waitFor();
    await page.reload();
    await page.getByText('Passage précédent incomplet', { exact: false }).waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('eopn.v1')).exams.length), 1);
    await page.locator('[data-resume]').tap();
    await page.getByText('3 / 16', { exact: true }).waitFor();
    await page.clock.fastForward(13 * 60 * 1000);
    await page.getByText('1/16 traitées · 15 omissions · 0 hors délai').waitFor();
    const resumed = await page.evaluate(() => JSON.parse(localStorage.getItem('eopn.v1')).exams[1]);
    assert.equal(resumed.n, 16);
    assert.equal(resumed.ok, 1);
    assert.equal(resumed.sections[0].omitted, 15);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await page.goto(base + '#/maths/probas');
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('heading', { name: 'Probabilités', exact: true }).waitFor();
    await context.close();
    console.log(device + ' : toucher, délai, examen interrompu et hors ligne OK');
  }
} finally {
  await browser.close();
}
