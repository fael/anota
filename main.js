const { menubar: createMenubar } = require("menubar");
const Store = require("electron-store");
const { ipcMain } = require("electron");

const store = new Store();
const menubar = createMenubar({
  preloadWindow: true,
  browserWindow: {
    webPreferences: {
      nodeIntegration: true
    }
  }
});

const [script, path, ...flags] = process.argv;

menubar.on("after-create-window", () => {
  const { webContents } = menubar.window;

  flags.includes("--devtools") && webContents.openDevTools(); // fixme: the Board may go dark mode

  // 'client' can have access from the store but for now I'm not going to expose it
  webContents.send(
    "read-board-content-from-store",
    store.get("app.board.content")
  );

  ipcMain.on("board-edited", async (event, changes) => {
    store.set({
      app: {
        board: {
          content: changes
        }
      }
    });
  });

  console.log("App is ready");
});
