import { BrowserWindow, ipcMain, App, dialog } from "electron";
import { importFile } from "./file-import.service";

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

    ipcMain.on("choose-file-dialog", async (event, arg) => {
      const result = await dialog.showOpenDialog(win, {
        properties: ["openFile"],
        defaultPath: arg,
        filters: [{
          name: 'MuseScore files',
          extensions: ['mscz'],
        },
        {
          name: 'Music XML files',
          extensions: ['musicxml'],
        }]
      });
      event.returnValue = result.canceled ? undefined : result.filePaths[0];
    });

    ipcMain.on("get-home-path", (event, arg) => {
      event.returnValue = app.getPath("home");
    });

    ipcMain.on("import-file", async (event, fileName, dataFilesFolder) => {
      importFile(fileName, dataFilesFolder);
      event.returnValue = null;
    });
  },
};
