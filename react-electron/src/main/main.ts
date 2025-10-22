import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  if (isDev) {
    // ✅ Development — use Vite’s dev server (HMR)
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools(); // optional for debugging
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
