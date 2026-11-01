const { app, BrowserWindow, Menu, Tray, Notification, nativeImage, ipcMain, screen, session, protocol, net, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

let dashboard;
let companion;
let tray;
let quitting = false;
let pinned = true;
const recentNotifications = new Map();
const referenceHosts = new Set(['www.kunming.cn', 'whwb.cjn.cn', 'art.people.com.cn', 'collection.sina.cn', 'www.sohu.com', 'k.sina.cn', 'www.bilibili.com', 'www.kxting.com', 'www.gia.edu']);
const APP_NAME = '盘物';
const entry = path.join(__dirname, '..', 'index.html');
const appURL = 'panwu://app/index.html';
protocol.registerSchemesAsPrivileged([{ scheme: 'panwu', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }]);
// A temporary profile lets automated smoke checks leave the user's save untouched.
if (process.env.PANWU_TEST_USER_DATA && path.isAbsolute(process.env.PANWU_TEST_USER_DATA)) {
  app.setPath('userData', process.env.PANWU_TEST_USER_DATA);
}

function trayIcon() {
  const size = 36;
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let filled = false;
      for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * Math.PI * 2;
        const bx = 18 + Math.cos(angle) * 11;
        const by = 18 + Math.sin(angle) * 11;
        if ((x - bx) ** 2 + (y - by) ** 2 < 3.5 ** 2) filled = true;
      }
      if (filled) {
        const offset = (y * size + x) * 4;
        pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = 25;
        pixels[offset + 3] = 255;
      }
    }
  }
  const icon = nativeImage.createFromBitmap(pixels, { width: size, height: size, scaleFactor: 2 });
  icon.setTemplateImage(true);
  return icon;
}

function secureWindow(window) {
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, destination) => {
    const expected = new URL(appURL);
    const actual = new URL(destination);
    if (actual.protocol !== expected.protocol || actual.hostname !== expected.hostname || actual.pathname !== expected.pathname) event.preventDefault();
  });
  window.webContents.on('will-attach-webview', event => event.preventDefault());
}

const preferences = () => ({
  preload: path.join(__dirname, 'preload.cjs'),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true,
  backgroundThrottling: false,
  spellcheck: false
});

function showDashboard() {
  if (!app.isReady()) {
    app.whenReady().then(showDashboard);
    return;
  }
  if (!dashboard || dashboard.isDestroyed()) createDashboard();
  const reopening = !dashboard.isVisible() || dashboard.isMinimized();
  if (dashboard.isMinimized()) dashboard.restore();
  dashboard.show();
  dashboard.focus();
  if (reopening && !dashboard.webContents.isLoadingMainFrame()) dashboard.webContents.send('desktop:resume-auto');
}

function showCompanion() {
  if (!companion || companion.isDestroyed()) createCompanion();
  const reopening = !companion.isVisible();
  companion.showInactive();
  if (reopening && !companion.webContents.isLoadingMainFrame()) companion.webContents.send('desktop:resume-auto');
  refreshTray();
}

function hideCompanion() {
  companion?.hide();
  refreshTray();
}

function createDashboard() {
  dashboard = new BrowserWindow({
    title: `${APP_NAME} · 文玩陪伴`,
    width: 1440,
    height: 980,
    minWidth: 1080,
    minHeight: 760,
    backgroundColor: '#f7f6f2',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 22 },
    show: false,
    webPreferences: preferences()
  });
  secureWindow(dashboard);
  dashboard.loadURL(appURL);
  dashboard.once('ready-to-show', () => dashboard.show());
  dashboard.on('close', event => {
    if (!quitting) {
      event.preventDefault();
      dashboard.hide();
      showCompanion();
    }
  });
}

function createCompanion() {
  const { x, y, width, height } = screen.getPrimaryDisplay().workArea;
  companion = new BrowserWindow({
    title: `${APP_NAME} · 桌面挂件`,
    width: 330,
    height: 390,
    x: x + width - 358,
    y: y + height - 420,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    alwaysOnTop: pinned,
    skipTaskbar: true,
    show: false,
    webPreferences: preferences()
  });
  secureWindow(companion);
  companion.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });
  companion.loadURL(`${appURL}?view=companion`);
  companion.once('ready-to-show', () => companion.showInactive());
  companion.on('close', event => {
    if (!quitting) {
      event.preventDefault();
      companion.hide();
      refreshTray();
    }
  });
}

function refreshTray() {
  if (!tray) return;
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '打开盘玩手记', click: showDashboard },
    { label: '显示桌面挂件', type: 'checkbox', checked: Boolean(companion?.isVisible()), click: item => item.checked ? showCompanion() : hideCompanion() },
    { label: '挂件始终置顶', type: 'checkbox', checked: pinned, click: item => {
      pinned = item.checked;
      companion?.setAlwaysOnTop(pinned);
    } },
    { type: 'separator' },
    { label: '退出盘物', accelerator: 'CommandOrControl+Q', click: () => app.quit() }
  ]));
}

function registerIPC() {
  const handle = (channel, callback) => ipcMain.handle(channel, (event, ...args) => {
    const trusted = [dashboard, companion].some(window => window && !window.isDestroyed() && window.webContents.id === event.sender.id);
    if (!trusted) throw new Error('Untrusted desktop request');
    const senderURL = new URL(event.senderFrame?.url || 'about:blank');
    const expectedURL = new URL(appURL);
    if (senderURL.protocol !== expectedURL.protocol || senderURL.hostname !== expectedURL.hostname || senderURL.pathname !== expectedURL.pathname) throw new Error('Untrusted desktop origin');
    return callback(...args);
  });
  handle('desktop:show-dashboard', showDashboard);
  handle('desktop:show-companion', showCompanion);
  handle('desktop:hide-companion', hideCompanion);
  handle('desktop:set-always-on-top', value => {
    pinned = Boolean(value);
    companion?.setAlwaysOnTop(pinned);
    refreshTray();
    return pinned;
  });
  handle('desktop:notify', message => {
    if (!Notification.isSupported()) return false;
    const title = String(message?.title || APP_NAME).slice(0, 100);
    const body = String(message?.body || '').slice(0, 300);
    const key = `${title}\u0000${body}`;
    const now = Date.now();
    if (now - (recentNotifications.get(key) || 0) < 5000) return false;
    recentNotifications.set(key, now);
    for (const [previousKey, timestamp] of recentNotifications) if (now - timestamp > 5000) recentNotifications.delete(previousKey);
    const notification = new Notification({ title, body, silent: true });
    notification.on('click', showDashboard);
    notification.show();
    return true;
  });
  handle('desktop:get-version', () => app.getVersion());
  handle('desktop:open-reference', async value => {
    if (typeof value !== 'string' || value.length > 2048 || /[\u0000-\u0020\u007f]/.test(value)) return false;
    let url;
    try { url = new URL(value); } catch { return false; }
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !referenceHosts.has(url.hostname)) return false;
    try {
      await shell.openExternal(url.href);
      return true;
    } catch {
      return false;
    }
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.setName(APP_NAME);
  app.on('second-instance', showDashboard);
  app.on('before-quit', () => { quitting = true; });
  app.on('activate', showDashboard);
  app.on('window-all-closed', () => { if (quitting) app.quit(); });
  app.whenReady().then(() => {
    const root = path.dirname(entry);
    protocol.handle('panwu', request => {
      const requested = new URL(request.url);
      const pathname = decodeURIComponent(requested.pathname);
      const target = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      const allowed = new Set(['.html', '.js', '.css', '.svg', '.png', '.webp', '.woff2']);
      if (requested.hostname !== 'app' || !target.startsWith(`${root}${path.sep}`) || pathname.split('/').some(segment => segment.startsWith('.') || ['node_modules', 'electron', 'tests', 'scripts', 'dist'].includes(segment)) || !allowed.has(path.extname(target))) {
        return new Response('Forbidden', { status: 403 });
      }
      return net.fetch(pathToFileURL(target).href);
    });
    session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    registerIPC();
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      { label: APP_NAME, submenu: [{ role: 'about' }, { type: 'separator' }, { label: '打开盘玩手记', click: showDashboard }, { label: '显示桌面挂件', click: showCompanion }, { type: 'separator' }, { role: 'quit', label: '退出盘物' }] },
      { label: '编辑', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
      { label: '窗口', submenu: [{ role: 'minimize' }, { role: 'close' }] }
    ]));
    tray = new Tray(trayIcon());
    tray.setToolTip(`${APP_NAME} · 慢慢盘，自有光`);
    tray.on('double-click', showDashboard);
    createDashboard();
    createCompanion();
    refreshTray();
  });
}
