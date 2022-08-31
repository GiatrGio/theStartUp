const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const fs = require("fs");
const { dialog } = require("electron");
const { createWorkspace } = require("./functions.js");

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

  win.loadURL("http://localhost:3000");
}

require("electron-reload")(__dirname);

ipcMain.handle("blender:version", async (_, args) => {
  console.log("running cli", _, args);
  let result;
  if (args) {
    const blenderExecutable = checkMacBlender(args);
    // If MacOS, we need to change path to make executable
    const checkVersionCommand = `${blenderExecutable} -v`;
    result = execSync(checkVersionCommand).toString();
  }
  return result;
});

app.on("ready", createWindow);

ipcMain.handle("openFolder", async (_, folderPath) => {
  console.log("heeeere");
  win.send("heeeere");
});

ipcMain.handle("dialog:open", async (_, args) => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "openDirectory"],
  });
  return result;
});

ipcMain.handle("openNewWorkspace", async (_, args) => {
  const dir = await dialog.showOpenDialog({ properties: ["openDirectory"] });

  const selectedDirectory = dir.filePaths[0];

  return createWorkspace(selectedDirectory);
});

ipcMain.on("notify", (_, message) => {
  fs.writeFile("test.txt", message, (err) => {
    if (!err) {
      console.log("File written");
    } else {
      console.log(err);
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// const createWorkspace = (selectedDirectory) => {
//   const workspaceName = getFileNameFromPath(selectedDirectory);
//   let workspace = initiateNewWorkspace(workspaceName);
//   addFolderItemsInWorkspace(selectedDirectory, workspace);
//   return workspace;
// };
//
// const addFolderItemsInWorkspace = (parentDirectory, workspace) => {
//   const t = fs.statSync(parentDirectory);
//   fs.readdirSync(parentDirectory).map((file) => {
//     if (!/^\..*/.test(file)) {
//       let fullFilePath = "";
//       fullFilePath = fullFilePath.concat(parentDirectory, "/", file);
//       const itemStats = fs.statSync(fullFilePath);
//       let itemName = file;
//       let isFileDirectory = itemStats.isDirectory();
//       if (isFileDirectory) {
//         let parentName = getFileNameFromPath(parentDirectory);
//         addItemInWorkspace(parentName, itemName, itemStats, workspace);
//         addFolderItemsInWorkspace(fullFilePath, workspace);
//       } else {
//         let parentName = parentDirectory.split("/").pop();
//
//         // @ts-ignore
//         addItemInWorkspace(parentName, itemName, itemStats, workspace);
//       }
//     }
//   });
// };
//
// const initiateNewWorkspace = (workspaceName) => {
//   let newWorkspace = {
//     rootId: workspaceName,
//     items: {},
//   };
//   newWorkspace.items[workspaceName] = {
//     id: workspaceName,
//     hasChildren: true,
//     isExpanded: false,
//     isChildrenLoading: false,
//     data: {
//       id: workspaceName,
//       type: "WORKSPACE",
//       name: workspaceName,
//       QCReportUrl: "",
//       size: "",
//       selected: false,
//     },
//     children: [],
//   };
//
//   return newWorkspace;
// };
// const addItemInWorkspace = (parentName, itemName, itemStats, newWorkspace) => {
//   const itemType = itemStats.isDirectory() ? "FOLDER" : getFileType(itemName);
//   const itemSize = itemStats.isFile() ? formatSize(itemStats.size ?? 0) : "";
//
//   newWorkspace.items[itemName] = {
//     id: itemName,
//     hasChildren: false,
//     isExpanded: false,
//     isChildrenLoading: false,
//     data: {
//       id: itemName,
//       type: itemType,
//       name: itemName,
//       QCReportUrl: "",
//       size: itemSize,
//       selected: false,
//     },
//     children: [],
//   };
//
//   newWorkspace.items[parentName].children.push(itemName);
//
//   return newWorkspace;
// };
// const getFileType = (itemName) => {
//   const itemEnding = itemName.split(".").pop();
//   switch (itemEnding) {
//     case "fastq":
//     case "fq":
//       return "FASTQ";
//     case "fasta":
//     case "fa":
//       return "FASTA";
//     case "bam":
//       return "BAM";
//     case "vcf":
//       return "VCF";
//     case "gff":
//       return "GFF";
//   }
//   return "UNKNOWN";
// };
// const formatSize = (size) => {
//   const i = Math.floor(Math.log(size) / Math.log(1024));
//   return (
//     Number((size / Math.pow(1024, i)).toFixed(2)) * 1 +
//     " " +
//     ["B", "kB", "MB", "GB", "TB"][i]
//   );
// };
//
// //TODO Probably needs to be adjusted for different operating systems.
// const getFileNameFromPath = (filePath) => {
//   const fileName = filePath.split("/").pop()?.split(".")[0];
//
//   if (fileName !== undefined) {
//     return fileName;
//   } else {
//     return "unknown file";
//   }
// };
