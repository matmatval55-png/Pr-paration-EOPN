// Vérifie que tous les fichiers de l'application sont bien mis en cache par le service worker.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

test('le service worker précharge tous les fichiers JS, CSS et icônes', () => {
  const sw = readFileSync('sw.js', 'utf8');
  const files = [...walk('js'), ...walk('css'), ...walk('icons')];
  const missing = files.filter((f) => !sw.includes(`'./${f.replace(/\\/g, '/')}'`));
  assert.deepEqual(missing, [], 'fichiers absents de sw.js : ' + missing.join(', '));
});

test('le repère de version affiché correspond à la version du service worker', async () => {
  const { readFileSync } = await import('node:fs');
  const { VERSION } = await import('../js/version.js');
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  assert.equal(`v${VERSION}`, sw.match(/const VERSION = '(v\d+)';/)[1]);
  const { versionMark } = await import('../js/version-badge.js');
  const a = versionMark(VERSION), b = versionMark(VERSION + 1);
  assert.ok(a.shape !== b.shape && a.color !== b.color, 'la forme et la couleur changent à chaque version');
});
