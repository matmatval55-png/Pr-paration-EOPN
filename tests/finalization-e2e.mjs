import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const base = process.argv[2] || 'http://localhost:8080/';
const browser = await chromium.launch(executablePath ? { executablePath } : {});

try {
  for (const device of ['iPad (gen 7) landscape', 'iPhone 13']) {
    const context = await browser.newContext(devices[device]);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.clock.install({ time: new Date('2026-11-25T12:00:00') });
    await page.goto(base + '#/laboratoire');
    await page.selectOption('#nav-scenario', '1');
    await page.getByText('vent 180° / 22 kt').waitFor();
    assert.equal(await page.locator('.navlab-instruments svg').count(), 4);
    await page.locator('#nav-obs').fill('270');
    await page.getByText('FROM', { exact: false }).first().waitFor();
    await page.locator('#nav-bank').fill('-20');
    await page.getByRole('button', { name: 'Démarrer' }).click();
    await page.clock.runFor(1500);
    assert.match(await page.locator('[data-reading]').innerText(), /inclinaison -\d+°/);
    await page.getByRole('button', { name: 'Pause' }).click();
    const stopped = await page.locator('[data-reading]').innerText();
    await page.clock.runFor(1000);
    assert.equal(await page.locator('[data-reading]').innerText(), stopped);
    await page.getByRole('button', { name: 'Recommencer' }).click();
    assert.equal(await page.locator('#nav-bank').inputValue(), '0');

    await page.evaluate(async () => {
      const { store } = await import('./js/core/store.js');
      store.update((s) => {
        s.settings.hoursPerWeek = 3.5;
        s.profile.dailyMinutes = 60;
        s.planning.snapshots = { '2026-11-24': [{ mod: 'maths', min: 30, key: 'maths-0' }] };
      });
      store.flush();
    });
    await page.goto(base + '#/planning');
    const carry = page.getByText('Report du 2026-11-24');
    await carry.waitFor();
    const carried = page.locator('[data-done^="r-"]');
    await carried.click();
    assert.equal(await carried.textContent(), '✔');
    await page.reload();
    assert.equal(await page.locator('[data-done^="r-"]').textContent(), '✔');
    assert.deepEqual(errors, []);
    console.log(device + ' : CDI et RMI interactifs, pause, report de séance et persistance OK');
    await context.close();
  }
} finally {
  await browser.close();
}
