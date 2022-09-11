const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  createFolder: async (name, path) =>
    ipcRenderer.invoke("createFolder", name, path),
  openNewWorkspace: async () => ipcRenderer.invoke("openNewWorkspace"),
  batteryApi: {},
  filesApi: {},
});

// https://whoisryosuke.com/blog/2022/using-nodejs-apis-in-electron-with-react/
