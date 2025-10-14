const { app, BrowserWindow } = require("electron/main");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  if (process.env.NODE_ENV === "development") {
    // Load your React dev server
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // Load built React files in production
    mainWindow.loadFile(path.join(__dirname, "../src/index.html"));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
