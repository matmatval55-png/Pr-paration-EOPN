import { test } from 'node:test';
import assert from 'node:assert/strict';
import { replanWeek } from '../js/planning/plan.js';

test('les reports suivent la priorité, le plafond, le repos et la date de sélection', () => {
  const dates = Array.from({ length: 7 }, (_, i) => `2026-11-${23 + i}`);
  const plan = { perDay: [[], [], [{ mod: 'maths', min: 30 }], [], [{ mod: 'maths', min: 30 }], [], []] };
  const source = { mod: 'maths', min: 60, key: 'maths-0' };
  const opts = { dates, today: dates[2], weak: ['maths'], selection: dates[4],
    snapshots: { [dates[0]]: [{ mod: 'anglais', min: 30, key: 'anglais-0' }], [dates[1]]: [source] }, done: {} };
  const result = replanWeek(plan, opts);
  const recovery = result.perDay[2][1];
  assert.equal(recovery.mod, 'maths');
  assert.equal(recovery.source, dates[1]);
  assert.equal(result.perDay[3].length, 0);
  assert.equal(result.perDay[4].length, 1);
  assert.equal(result.backlog, 2);
  opts.snapshots[dates[2]] = [recovery];
  opts.done[dates[2]] = { [recovery.key]: true };
  assert.equal(replanWeek(plan, opts).perDay[2][1].key, recovery.key);
  const later = replanWeek(plan, { ...opts, today: dates[4], selection: '' });
  assert.equal(later.perDay[4][1].key, recovery.key.replace(/-0$/, '-30'));
  assert.equal(later.backlog, 1);
  assert.equal(replanWeek(plan, { ...opts, today: dates[4], selection: '', cap: 45 }).perDay[4].length, 1);
});
