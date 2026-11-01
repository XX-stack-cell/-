import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOG, STAGES, createState, normalizeState, advance, selectItem, setRunning, setSpeed, setCare, performCare, unlockProduct, claimReward, deriveItem, getCareAdvice, getItemStages, setInteraction, manualStroke } from '../src/engine.js';

const BASE = new Date('2026-11-01T10:00:00+08:00').getTime();
function run(seconds, { state = selectItem(createState(BASE), 'corn', BASE), speed = 1 } = {}) {
  let result = setRunning(setSpeed(state, speed, BASE), true, BASE);
  for (let elapsed = 1; elapsed <= seconds; elapsed++) result = advance(result, BASE + elapsed * 1000);
  return result;
}

test('free starter objects exist and paid objects cannot be selected', () => {
  const initial = createState(BASE);
  assert.deepEqual(initial.inventory, ['corn', 'gourd', 'walnut']);
  assert.equal(selectItem(initial, 'zitan', BASE), initial);
  assert.equal(selectItem(initial, 'invalid', BASE), initial);
  assert.equal(CATALOG.length, 12);
});

test('pause earns no progress and advance never mutates the caller', () => {
  const initial = setRunning(createState(BASE), false, BASE);
  const snapshot = JSON.stringify(initial);
  assert.equal(advance(initial, BASE + 5000).items.corn.seconds, 0);
  assert.equal(JSON.stringify(initial), snapshot);
  const active = run(3);
  assert.equal(active.items.corn.seconds, 3);
  const paused = setRunning(active, false, BASE + 3000);
  assert.equal(advance(paused, BASE + 16000).items.corn.seconds, 3);
});

test('wall-clock jumps and background gaps cannot generate unlimited progress', () => {
  const active = setRunning(selectItem(createState(BASE), 'corn', BASE), true, BASE);
  assert.equal(advance(active, BASE + 86400000).items.corn.seconds, 5);
  assert.equal(advance(active, BASE - 5000).items.corn.seconds, 0);
  const restored = normalizeState(active, BASE + 86400000);
  assert.equal(advance(restored, BASE + 86400000).items.corn.seconds, 0);
});

test('day preview produces a single item-specific milestone across repeated ticks', () => {
  const state = run(16, { speed: 86400 });
  assert.equal(state.items.corn.seconds, 16 * 86400);
  assert.equal(state.rewards.filter(value => value.id === 'corn:warm').length, 1);
  assert.equal(deriveItem(state).progress.stage.name, '磨合');
  const next = advance(state, BASE + 17000);
  assert.equal(next.rewards.filter(value => value.id === 'corn:warm').length, 1);
});

test('reward claim is idempotent and survives serialization', () => {
  let state = run(16, { speed: 86400 });
  state = claimReward(state, 'corn:warm', BASE + 16000);
  assert.equal(state.points, STAGES[1].reward);
  assert.deepEqual(state.items.corn.claimedStages, ['warm']);
  assert.equal(claimReward(state, 'corn:warm', BASE + 16000), state);
  const restored = normalizeState(JSON.parse(JSON.stringify(state)), BASE + 16000);
  assert.equal(claimReward(restored, 'corn:warm', BASE + 16000), restored);
  assert.equal(advance(restored, BASE + 17000).rewards.filter(value => value.id === 'corn:warm').length, 1);
});

test('switching objects preserves separate progress', () => {
  let state = run(3);
  state = selectItem(state, 'gourd', BASE + 3000);
  state = advance(state, BASE + 4000);
  state = selectItem(state, 'corn', BASE + 4000);
  assert.equal(state.items.corn.seconds, 3);
  assert.equal(state.items.gourd.seconds, 1);
  assert.equal(state.selectedId, 'corn');
});

test('sweaty hands lower efficiency of sensitive materials; gloves restore protection', () => {
  let initial = unlockProduct(createState(BASE), 'zitan', BASE);
  initial = selectItem(initial, 'zitan', BASE);
  initial = setCare(initial, 'hand', 'sweaty', BASE);
  assert.ok(getCareAdvice(initial).some(value => value.title === '有点怕汗'));
  const sweaty = run(1, { state: initial });
  initial = unlockProduct(initial, 'glove', BASE);
  initial = setCare(initial, 'method', 'glove', BASE);
  assert.ok(!getCareAdvice(initial).some(value => value.title === '有点怕汗'));
  assert.ok(run(1, { state: initial }).items.zitan.seconds > sweaty.items.zitan.seconds);
});

test('unowned tools cannot activate; care actions recover health and rest pauses', () => {
  const initial = createState(BASE);
  assert.equal(setCare(initial, 'method', 'glove', BASE), initial);
  const dirty = selectItem(createState(BASE), 'corn', BASE);
  dirty.items.corn.cleanliness = 10;
  assert.equal(performCare(dirty, 'clean', BASE).items.corn.cleanliness, 100);
  dirty.items.corn.moisture = 5;
  assert.equal(performCare(dirty, 'hydrate', BASE).items.corn.moisture, 50);
  assert.equal(performCare(setRunning(dirty, true, BASE), 'rest', BASE).running, false);
});

test('unlocking a demo product is explicit and idempotent', () => {
  const initial = createState(BASE);
  assert.equal(initial.inventory.includes('zitan'), false);
  const unlocked = unlockProduct(initial, 'zitan', BASE);
  assert.equal(unlocked.inventory.includes('zitan'), true);
  assert.equal(initial.inventory.includes('zitan'), false);
  assert.equal(unlockProduct(unlocked, 'zitan', BASE), unlocked);
  assert.equal(unlockProduct(unlocked, 'missing', BASE), unlocked);
});

test('normalization rejects arbitrary shape, unknown ids and nonfinite values', () => {
  assert.deepEqual(normalizeState(null, BASE), createState(BASE));
  const restored = normalizeState({ selectedId: 'evil', inventory: ['evil', 'zitan', 'zitan'], tools: ['evil'], speed: 5000, care: { method: 'glove', humidity: Infinity, temperature: NaN }, items: { corn: { seconds: -30, cleanliness: NaN, moisture: 999, claimedStages: ['evil'] } }, rewards: [{ id: 'corn:heirloom', itemId: 'corn', stage: 'heirloom', points: Infinity }], stats: { totalSeconds: NaN }, points: Infinity }, BASE);
  assert.equal(restored.selectedId, 'gourd');
  assert.equal(restored.speed, 1);
  assert.equal(restored.care.method, 'bare');
  assert.equal(restored.items.corn.seconds, 0);
  assert.equal(restored.items.corn.cleanliness, 94);
  assert.equal(restored.items.corn.moisture, 100);
  assert.equal(restored.rewards.length, 0);
  assert.equal(restored.points, 0);
  assert.deepEqual(restored.inventory, ['corn', 'gourd', 'walnut', 'zitan']);
});

test('daily one-quarter-hour reward is issued once and daily stats roll over', () => {
  let state = run(900, { speed: 60 });
  assert.equal(state.stats.realTodaySeconds, 900);
  assert.equal(state.rewards.filter(value => value.id.startsWith('daily:')).length, 1);
  state = advance(state, BASE + 901000);
  assert.equal(state.rewards.filter(value => value.id.startsWith('daily:')).length, 1);
  state = setRunning(state, false, BASE + 901000);
  state = advance(state, BASE + 86400000);
  assert.equal(state.stats.todaySeconds, 0);
});

test('invalid care input is ignored; environment and progress remain bounded', () => {
  const initial = createState(BASE);
  assert.equal(setCare(initial, 'humidity', NaN, BASE), initial);
  assert.equal(setCare(initial, '__proto__', {}, BASE), initial);
  assert.equal(setSpeed(initial, 999, BASE), initial);
  assert.equal(setCare(initial, 'humidity', 999, BASE).care.humidity, 90);
  const complete = createState(BASE);
  complete.items.corn.seconds = 1e8;
  const derived = deriveItem(complete, 'corn');
  assert.equal(derived.progress.percent, 100);
  assert.equal(derived.progress.remainingSeconds, 0);
  assert.equal(derived.progress.nextStage, null);
});

test('wooden objects need rest and humidity box stabilizes the simulated environment', () => {
  let state = createState(BASE);
  state.items.gourd.continuousSeconds = 1800;
  assert.ok(getCareAdvice(state).some(value => value.title === '该静置一会儿了'));
  state = performCare(state, 'rest', BASE);
  assert.ok(!getCareAdvice(state).some(value => value.title === '该静置一会儿了'));
  state = setCare(state, 'humidity', 85, BASE);
  assert.ok(getCareAdvice(state).some(value => value.title === '环境偏热或偏湿'));
  state = unlockProduct(state, 'humidity-box', BASE);
  assert.ok(!getCareAdvice(state).some(value => value.title === '环境偏热或偏湿'));
});

test('conflicting saved reward claim markers never award the same stage twice', () => {
  const state = run(16, { speed: 86400 });
  state.items.corn.claimedStages = ['warm'];
  const restored = normalizeState(state, BASE + 16000);
  assert.equal(restored.rewards.find(value => value.id === 'corn:warm').claimed, true);
  assert.equal(claimReward(restored, 'corn:warm', BASE + 16000).points, 0);
  assert.equal(claimReward(state, 'corn:warm', BASE + 16000).points, 0);
  state.items.corn.claimedStages = [];
  state.rewards.find(value => value.id === 'corn:warm').claimed = true;
  const reverse = normalizeState(state, BASE + 16000);
  assert.ok(reverse.items.corn.claimedStages.includes('warm'));
});

test('duplicate daily rewards merge claim status and cannot retain bogus item metadata', () => {
  const state = run(900);
  const daily = state.rewards.find(value => value.id.startsWith('daily:'));
  state.rewards.push({ ...daily, claimed: true, itemId: 'not-an-item', stage: 'bogus' });
  const restored = normalizeState(state, BASE + 16000);
  assert.equal(restored.rewards.filter(value => value.id === daily.id).length, 1);
  assert.equal(restored.rewards.find(value => value.id === daily.id).claimed, true);
  assert.equal(restored.rewards.find(value => value.id === daily.id).itemId, null);
  assert.equal(claimReward(restored, daily.id, BASE + 16000).points, 0);
});

test('actual companion time is independent of simulation speed and pauses cleanly', () => {
  const slow = run(16);
  const demo = run(16, { speed: 60 });
  assert.equal(slow.stats.realTotalSeconds, 16);
  assert.equal(demo.stats.realTotalSeconds, 16);
  assert.equal(demo.stats.realTodaySeconds, 16);
  assert.equal(demo.stats.todaySeconds, 960);
  const paused = setRunning(demo, false, BASE + 16000);
  assert.equal(advance(paused, BASE + 17000).stats.realTotalSeconds, 16);
  const restored = normalizeState(demo, BASE + 16000);
  assert.equal(restored.stats.realTodaySeconds, 16);
  const tomorrow = advance(paused, BASE + 86400000);
  assert.equal(tomorrow.stats.realTodaySeconds, 0);
  assert.equal(tomorrow.stats.realTotalSeconds, 16);
});

test('each material supplies its own calendar-length reference stages and source limits', () => {
  for (const item of CATALOG) {
    const stages = getItemStages(item.id);
    assert.equal(stages.length, 5);
    assert.equal(stages[0].seconds, 0);
    for (let i = 1; i < stages.length; i++) assert.ok(stages[i].seconds > stages[i - 1].seconds);
    assert.ok(item.timelineNote.includes('游戏设定'));
    assert.ok(item.timelineSources.length > 0);
  }
  assert.equal(getItemStages('zijinshu')[1].seconds, 7 * 86400);
  assert.equal(getItemStages('walnut')[4].seconds, 5 * 365 * 86400);
  assert.equal(getItemStages('hetian')[4].seconds, 10 * 365 * 86400);
  assert.notDeepEqual(getItemStages('gourd'), getItemStages('walnut'));
  assert.deepEqual(deriveItem(createState(BASE)).progress.stages, getItemStages('gourd'));
});

test('same simulation age yields different stages and normalized rewards use the item curve', () => {
  const state = createState(BASE);
  state.items.corn.seconds = 30 * 86400;
  state.items.zijinshu.seconds = 30 * 86400;
  assert.equal(deriveItem(state, 'corn').progress.stageIndex, 1);
  assert.equal(deriveItem(state, 'zijinshu').progress.stageIndex, 2);
  state.rewards = [{ id: 'corn:polish', itemId: 'corn', stage: 'polish', claimed: false }];
  assert.equal(normalizeState(state, BASE).rewards.length, 0);
});

test('30-day-per-second preview is explicit, preserves health and never accelerates daily rewards', () => {
  const state = run(1, { speed: 2592000 });
  assert.equal(state.speed, 2592000);
  assert.equal(state.items.corn.seconds, 30 * 86400);
  assert.equal(state.stats.realTodaySeconds, 1);
  assert.equal(state.items.corn.continuousSeconds, 1);
  assert.ok(state.items.corn.cleanliness > 93);
  assert.ok(state.rewards.some(value => value.id === 'corn:warm'));
  assert.ok(!state.rewards.some(value => value.id.startsWith('daily:')));
  assert.equal(normalizeState(state, BASE + 1000).speed, 2592000);
});

test('jade and coconut shell stay in their own color family as gloss grows', () => {
  const state = createState(BASE);
  for (const id of ['hetian', 'yedi']) {
    const before = deriveItem(state, id);
    state.items[id].seconds = getItemStages(id)[4].seconds;
    const after = deriveItem(state, id);
    assert.equal(after.progress.color, 0);
    assert.equal(after.color, before.color);
    assert.ok(after.progress.gloss > before.progress.gloss);
  }
});

test('opening starts automatic rolling, hovering without movement stops progress', () => {
  let state = createState(BASE);
  assert.equal(state.running, true);
  state = advance(state, BASE + 1000);
  assert.equal(state.items.gourd.seconds, 1);
  state = setInteraction(state, 'dashboard', true, BASE + 1000);
  state = advance(state, BASE + 2000);
  assert.equal(state.items.gourd.seconds, 1);
  assert.equal(state.stats.realTodaySeconds, 1);
});

test('manual motion counts only moving overlap and heartbeat preserves the stroke window', () => {
  let state = setInteraction(createState(BASE), 'dashboard', true, BASE);
  state = manualStroke(state, 'dashboard', BASE + 500);
  state = advance(state, BASE + 600);
  assert.ok(Math.abs(state.items.gourd.seconds - 0.1) < 1e-9);
  state = setInteraction(state, 'dashboard', true, BASE + 600);
  assert.equal(state.interaction.movingUntil, BASE + 750);
  state = advance(state, BASE + 1000);
  assert.ok(Math.abs(state.items.gourd.seconds - 0.25) < 1e-9);
  assert.ok(Math.abs(state.stats.realTodaySeconds - 0.25) < 1e-9);
  state = advance(state, BASE + 1500);
  assert.ok(Math.abs(state.items.gourd.seconds - 0.25) < 1e-9);
});

test('pointer leave resumes automatic progress and stale owner lease recovers automatically', () => {
  let state = setInteraction(createState(BASE), 'widget', true, BASE);
  state = setInteraction(state, 'widget', false, BASE + 1000);
  state = advance(state, BASE + 2000);
  assert.equal(state.items.gourd.seconds, 1);
  const stale = setInteraction(createState(BASE), 'widget', true, BASE);
  const recovered = advance(stale, BASE + 4000);
  assert.equal(recovered.interaction.owner, null);
  assert.equal(recovered.items.gourd.seconds, 1);
});

test('one surface owns manual mode; foreign strokes and releases cannot steal it', () => {
  let state = setInteraction(createState(BASE), 'dashboard', true, BASE);
  assert.equal(setInteraction(state, 'widget', true, BASE + 500), state);
  assert.equal(manualStroke(state, 'widget', BASE + 500), state);
  assert.equal(setInteraction(state, 'widget', false, BASE + 500), state);
  state = setInteraction(state, 'widget', true, BASE + 3500);
  assert.equal(state.interaction.owner, 'widget');
  assert.equal(state.items.gourd.seconds, 0.5);
  const restored = normalizeState(state, BASE + 3600);
  assert.equal(restored.interaction.owner, 'widget');
  assert.equal(normalizeState(restored, BASE + 7000).interaction.owner, null);
  const paused = setRunning(manualStroke(state, 'widget', BASE + 3600), false, BASE + 3600);
  assert.equal(advance(paused, BASE + 3700).items.gourd.seconds, paused.items.gourd.seconds);
});
