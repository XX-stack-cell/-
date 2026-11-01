import { _electron as electron } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const profile = await mkdtemp(path.join(os.tmpdir(), 'panwu-desktop-smoke-'));
let application;
try {
  application = await electron.launch({
    ...(process.env.PANWU_EXECUTABLE ? { executablePath: process.env.PANWU_EXECUTABLE } : {}),
    args: process.env.PANWU_EXECUTABLE ? [] : [root],
    env: { ...process.env, PANWU_TEST_USER_DATA: profile },
    timeout: 30000
  });
  const dashboard = await application.firstWindow();
  await dashboard.waitForLoadState('domcontentloaded');
  await dashboard.waitForFunction(() => window.panchuanDesktop?.isDesktop === true);
  const desktop = await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().map(window => ({
    url: window.webContents.getURL(),
    pinned: window.isAlwaysOnTop(),
    visible: window.isVisible(),
    preferences: window.webContents.getLastWebPreferences()
  })));
  assert.equal(desktop.length, 2, 'dashboard and companion created');
  for (const window of desktop) {
    assert.equal(window.preferences.contextIsolation, true);
    assert.equal(window.preferences.nodeIntegration, false);
    assert.equal(window.preferences.sandbox, true);
  }
  const companion = desktop.find(window => window.url.includes('view=companion'));
  assert.ok(companion?.pinned, 'companion stays on top');
  const companionPage = application.windows().find(page => page.url().includes('view=companion'));
  await companionPage.waitForLoadState('networkidle');
  assert.equal(await dashboard.evaluate(() => Boolean(navigator.locks)), true, 'Web Locks are available');
  await dashboard.evaluate(() => localStorage.setItem('__panwu_shell_smoke', 'shared'));
  assert.equal(await companionPage.evaluate(() => localStorage.getItem('__panwu_shell_smoke')), 'shared', 'both windows share one save origin');
  const heldLock = dashboard.evaluate(() => navigator.locks.request('panwu-shell-smoke', async () => {
    localStorage.setItem('__panwu_shell_smoke', 'locked');
    await new Promise(resolve => { window.__releasePanwuSmokeLock = resolve; });
    localStorage.setItem('__panwu_shell_smoke', 'released');
  }));
  await dashboard.waitForFunction(() => typeof window.__releasePanwuSmokeLock === 'function', { polling: 30 });
  await companionPage.evaluate(() => {
    window.__panwuSmokeAcquired = false;
    window.__panwuSmokePending = navigator.locks.request('panwu-shell-smoke', () => {
      window.__panwuSmokeAcquired = true;
      return localStorage.getItem('__panwu_shell_smoke');
    });
  });
  assert.equal(await companionPage.evaluate(() => window.__panwuSmokeAcquired), false, 'second window waits on held lock');
  await dashboard.evaluate(() => window.__releasePanwuSmokeLock());
  const observed = await companionPage.evaluate(() => window.__panwuSmokePending);
  await heldLock;
  assert.equal(observed, 'released', 'Web Locks serialize both windows');
  await dashboard.evaluate(() => localStorage.removeItem('__panwu_shell_smoke'));
  const cornerAlpha = await application.evaluate(async ({ BrowserWindow }) => {
    const window = BrowserWindow.getAllWindows().find(item => item.webContents.getURL().includes('view=companion'));
    const image = await window.webContents.capturePage({ x: 0, y: 0, width: 1, height: 1 });
    return image.toBitmap()[3];
  });
  assert.equal(cornerAlpha, 0, 'companion surface keeps transparent corners');
  assert.equal(await dashboard.evaluate(() => typeof window.require), 'undefined');
  assert.equal(await dashboard.evaluate(() => typeof window.process), 'undefined');
  const gripDimensions = await dashboard.evaluate(async () => {
    const assets = ['pinch', 'walnut', 'beads', 'loose'].flatMap(pose => ['bare', 'glove'].map(method => `reference-${pose}-${method}.png`));
    return Promise.all(assets.map(async asset => {
      const image = new Image();
      image.src = new URL(`assets/interactions/${asset}`, location.href).href;
      await image.decode();
      return { asset, width: image.naturalWidth, height: image.naturalHeight };
    }));
  });
  assert.equal(gripDimensions.length, 8, 'all four bare/glove pose pairs are checked');
  for (const image of gripDimensions) assert.ok(image.width >= 1024 && image.height >= 1024 && image.width === image.height, `${image.asset} decodes as a square high-resolution asset through the app protocol`);
  assert.equal(await dashboard.evaluate(async () => typeof (await import('./src/patina.js')).getPatinaAppearance), 'function', 'packaged ageing module loads');
  for (const url of ['file:///etc/passwd', 'https://example.com/', 'https://www.gia.edu.evil.invalid/', 'https://user:pass@www.gia.edu/', 'https://www.gia.edu:444/', 'javascript:alert(1)']) {
    assert.equal(await dashboard.evaluate(value => window.panchuanDesktop.openReference(value), url), false, 'external references reject untrusted URLs');
  }
  const isRunning = () => dashboard.evaluate(() => JSON.parse(localStorage.getItem('panwu-state-v1')).running);
  async function pause() {
    if (await isRunning()) await dashboard.locator('[data-action=toggle]').click();
    await dashboard.waitForFunction(() => JSON.parse(localStorage.getItem('panwu-state-v1')).running === false);
  }
  async function waitForAuto() {
    await dashboard.waitForFunction(() => JSON.parse(localStorage.getItem('panwu-state-v1')).running === true);
  }
  await waitForAuto();
  await pause();
  await dashboard.evaluate(() => window.panchuanDesktop.showCompanion());
  assert.equal(await isRunning(), false, 'showing an already visible companion preserves deliberate pause');
  await dashboard.evaluate(() => window.panchuanDesktop.hideCompanion());
  assert.equal(await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().find(window => window.webContents.getURL().includes('view=companion')).isVisible()), false);
  await dashboard.evaluate(() => window.panchuanDesktop.showCompanion());
  await waitForAuto();
  await pause();
  await dashboard.evaluate(() => window.panchuanDesktop.showDashboard());
  assert.equal(await isRunning(), false, 'focusing an already visible dashboard preserves deliberate pause');
  await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().find(window => !window.webContents.getURL().includes('view=companion')).close());
  assert.equal(await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().length), 2, 'closing dashboard preserves companion');
  assert.equal(await isRunning(), false, 'hiding dashboard does not implicitly resume');
  await dashboard.evaluate(() => window.panchuanDesktop.showDashboard());
  await waitForAuto();
  await pause();
  await application.evaluate(({ BrowserWindow }) => new Promise(resolve => {
    const window = BrowserWindow.getAllWindows().find(item => !item.webContents.getURL().includes('view=companion'));
    window.once('minimize', resolve);
    window.minimize();
  }));
  await dashboard.evaluate(() => window.panchuanDesktop.showDashboard());
  await waitForAuto();
  console.log('Desktop smoke passed: secure windows, transparency, shared locks, eight reference-pose assets, ageing module, safe references and auto-resume only on hidden/minimized reopen.');
} finally {
  await application?.close();
  await rm(profile, { recursive: true, force: true });
}
