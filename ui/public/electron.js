const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const fs = require("fs");
const { dialog } = require("electron");
const { createWorkspace } = require("./functions.js");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  win.webContents.openDevTools()

  win.loadURL(isDev? "http://localhost:3000": `file://${__dirname}/../build/index.html`);
}

// require("electron-reload")(__dirname);

app.on("ready", createWindow);

ipcMain.handle("createFolder", async (event, fileName, filePath) => {
  const newDirectory = filePath + "/" + fileName;
  if (!fs.existsSync(newDirectory)) {
    fs.mkdirSync(newDirectory, function (err) {
      if (err) throw err;
      return false;
    });
  }

  return true;
});

ipcMain.handle("openNewWorkspace", async (_, args) => {
  const dir = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  const selectedDirectory = dir.filePaths[0];
  return createWorkspace(selectedDirectory);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
