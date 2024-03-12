const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  SendToElectron: (channel, data) => ipcRenderer.send(channel, data),
  ReceiveFromElectron: (channel, callback) =>
    ipcRenderer.on(channel, (ev, ...args) => callback(ev, ...args)),
  BidirectionalCommunication: (channel) => ipcRenderer.invoke(channel),
});
