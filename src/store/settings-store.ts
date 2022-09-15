import { ipcRenderer } from "electron";
import { defineStore } from "pinia";
import { storage } from "../utils/local_storage";

const homePath = ipcRenderer.sendSync("get-home-path");
const initialDataFilesPath = storage.getString("data-files-path", `${homePath}/.music`);
ipcRenderer.sendSync("create-folder", initialDataFilesPath);
console.debug("initialDataFilesPath", initialDataFilesPath);

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    _shown: false,
    _dataFilesPath: initialDataFilesPath,
  }),

  getters: {
    shown(state): boolean {
      return state._shown;
    },

    dataFilesPath(state): string {
      return state._dataFilesPath;
    },
  },

  actions: {
    setShown(shown: boolean) {
      this._shown = shown;
    },

    setDataFilesPath(path: string) {
      this._dataFilesPath = path;
      localStorage.setItem("data-files-path", path);
    },
  },
});
