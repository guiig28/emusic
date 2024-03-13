const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

let mainWindow;

const musicDir = path.join(__dirname, "..", "public", "music");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/preload.js`,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("music-upload", (ev, file) => {
  const filePath = path.join(musicDir, file.name);
  fs.writeFile(filePath, file.data, async (err) => {
    if (err) {
      mainWindow.webContents.send("toast:receive", err);
    } else {
      sendUpdateList();
      mainWindow.webContents.send(
        "toast:receive",
        "File uploaded successfully"
      );
    }
  });
});

ipcMain.on("music-get", async () => {
  sendUpdateList();
});

async function sendUpdateList() {
  const files = await fs.promises.readdir(musicDir);
  mainWindow.webContents.send("music-list", files);
}

ipcMain.on("music-delete", async (ev, file) => {
  const filePath = path.join(musicDir, file);
  fs.unlink(filePath, async (err) => {
    if (err) {
      mainWindow.webContents.send("toast:receive", err);
    } else {
      sendUpdateList();
      mainWindow.webContents.send("toast:receive", "File deleted successfully");
    }
  });
});

ipcMain.on("music-to-play", (ev, fileName) => {
  mainWindow.webContents.send("music-playable", fileName);
});
