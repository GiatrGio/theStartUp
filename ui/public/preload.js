const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  sendNotification(message) {
    ipcRenderer.send("notify", message);
  },
  openFolder(folderPath) {
    ipcRenderer.invoke("openFolder", folderPath);
  },
  createFolder(name) {
    ipcRenderer.send("createFolder", name);
  },
  showDialog: async () => ipcRenderer.invoke("dialog:open"),
  openNewWorkspace: async () => ipcRenderer.invoke("openNewWorkspace"),
  batteryApi: {},
  filesApi: {},
});

// https://whoisryosuke.com/blog/2022/using-nodejs-apis-in-electron-with-react/
