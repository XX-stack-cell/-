const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('panchuanDesktop', Object.freeze({
  isDesktop: true,
  showDashboard: () => ipcRenderer.invoke('desktop:show-dashboard'),
  showCompanion: () => ipcRenderer.invoke('desktop:show-companion'),
  hideCompanion: () => ipcRenderer.invoke('desktop:hide-companion'),
  setAlwaysOnTop: value => ipcRenderer.invoke('desktop:set-always-on-top', Boolean(value)),
  notify: message => ipcRenderer.invoke('desktop:notify', {
    title: String(message?.title || '').slice(0, 100),
    body: String(message?.body || '').slice(0, 300)
  }),
  getVersion: () => ipcRenderer.invoke('desktop:get-version'),
  openReference: url => ipcRenderer.invoke('desktop:open-reference', typeof url === 'string' ? url : ''),
  onResumeAuto: callback => {
    if (typeof callback !== 'function') return () => {};
    const listener = () => callback();
    ipcRenderer.on('desktop:resume-auto', listener);
    return () => ipcRenderer.removeListener('desktop:resume-auto', listener);
  }
}));
