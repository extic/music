import { defineStore } from "pinia";
import { useSettingsStore } from "./settings-store";
import { Song, saveSongJson } from "../services/song-serializer.service";

export const useSongStore = defineStore("song", {
  state: () => ({
    _songList: [] as Song[],
    _selectedSong: null as Song | null,
    _filter: "",
    _showFavorites: false,
    _editSongPaneShown: false,
  }),

  getters: {
    songList(state): Song[] {
      return state._songList;
    },

    selectedSong(state): Song | null {
      return state._selectedSong;
    },

    filter(state): string {
      return state._filter;
    },

    showFavorites(state): boolean {
      return state._showFavorites;
    },

    editSongPaneShown(state): boolean {
      return state._editSongPaneShown;
    },
  },

  actions: {
    setSongList(songList: Song[]) {
      this._songList = songList;
    },

    setSelectedSong(selectedSong: Song | null) {
      this._selectedSong = selectedSong;
    },

    setFavorite(songId: string, favorite: boolean) {
      const song = this._songList.find((it) => it.id === songId);
      if (song) {
        song.favorite = favorite;

        const settings = useSettingsStore();
        saveSongJson(song);
      }
    },

    // loadSongs() {
    //   const settings = useSettingsStore();
    //   this._songList = <Song[]>ipcRenderer.sendSync("load-songs", settings.dataFilesPath).songs;
    // },

    setFilter(filter: string): void {
      this._filter = filter;
    },

    setShowFavorites(showFavorites: boolean): void {
      this._showFavorites = showFavorites;
    },

    setEditSongPaneShown(editSongPaneShown: boolean): void {
      this._editSongPaneShown = editSongPaneShown;
    },
  },
});
