import { BrowserWindow, ipcMain, App, dialog } from "electron";

export const eventRegistrar = {
  registerEvents: (win: BrowserWindow, app: App) => {
    ipcMain.on("get-app-version", () => {
      win.webContents.send("app-version", app.getVersion());
    });

    ipcMain.on("open-folder-dialog", (event, arg) => {
      const dir = dialog.showOpenDialogSync(win, {
        properties: ["openDirectory"],
        defaultPath: arg,
      });
      event.returnValue = dir?.[0];
    });

    ipcMain.on("get-home-path", (event, arg) => {
      event.returnValue = app.getPath("home");
    });
  },
};
