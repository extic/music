import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    _keyboardButtonShown: false,
    _keyboardShown: false,
  }),

  getters: {
    keyboardButtonShown(state): boolean {
      return state._keyboardButtonShown;
    },

    keyboardShown(state): boolean {
      return state._keyboardShown;
    },
  },

  actions: {
    setKeyboardButtonShown(show: boolean): void {
      this._keyboardButtonShown = show;
    },

    setKeyboardShown(show: boolean): void {
      this._keyboardShown = show;
    },
  },
});
