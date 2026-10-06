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
