const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    width: 1024,
    height: 1024,
    useContentSize: true,
    show: false,
    transparent: true,
    webPreferences: { offscreen: true, sandbox: true, nodeIntegration: false, contextIsolation: true }
  });
  const svg = fs.readFileSync(path.join(root, 'assets/icon.svg')).toString('base64');
  const html = `<html><body style="margin:0;background:transparent;overflow:hidden"><img style="width:100vw;height:100vh;display:block" src="data:image/svg+xml;base64,${svg}"></body></html>`;
  await window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  await window.webContents.executeJavaScript('document.images[0].decode()');
  const rendered = await window.webContents.capturePage();
  const chunks = [[128, 'ic07'], [256, 'ic08'], [512, 'ic09'], [1024, 'ic10']].map(([size, type]) => {
    const png = rendered.resize({ width: size, height: size, quality: 'best' }).toPNG();
    const header = Buffer.alloc(8);
    header.write(type);
    header.writeUInt32BE(png.length + 8, 4);
    return Buffer.concat([header, png]);
  });
  const header = Buffer.alloc(8);
  header.write('icns');
  header.writeUInt32BE(chunks.reduce((sum, chunk) => sum + chunk.length, 8), 4);
  fs.writeFileSync(path.join(root, 'assets/icon.icns'), Buffer.concat([header, ...chunks]));
  fs.writeFileSync(path.join(root, 'assets/icon.png'), rendered.resize({ width: 512, height: 512, quality: 'best' }).toPNG());
  console.log('Native app icon rendered from assets/icon.svg.');
  app.quit();
}).catch(error => { console.error(error); app.exit(1); });
