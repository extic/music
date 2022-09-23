import { defineStore } from "pinia";
import { storage } from "../utils/local_storage";

export const useMidiStore = defineStore("midi", {
  state: () => ({
    _connected: false,
    // _pressedKeys: [] as number[],
    _correctToneVelocity: storage.getNumber("correctToneVelocity", 0x2f),
    _userVelocity: storage.getNumber("userVelocity", 0),
    _useUserVelocityForAccompanying: storage.getBoolean("useUserVelocityForAccompanying", false),
    _accompanyVelocity: storage.getNumber("accompanyVelocity", 0x40),
  }),

  getters: {
    connected(state): boolean {
      return state._connected;
    },

    // pressedKeys(state): number[] {
    //   return state._pressedKeys;
    // },

    correctToneVelocity(state): number {
      return state._correctToneVelocity;
    },

    userVelocity(state): number {
      return state._userVelocity;
    },

    useUserVelocityForAccompanying(state): boolean {
      return state._useUserVelocityForAccompanying;
    },

    accompanyVelocity(state): number {
      return state._accompanyVelocity;
    },
  },

  actions: {
    setConnected(connected: boolean) {
      this._connected = connected;
    },

    // setPressedKeys(pressedKeys: number[]) {
    //   this._pressedKeys = pressedKeys;
    // },

    // keyOn(key: number, velocity: number) {
    //   const existingKey = this._pressedKeys.find((it) => it === key);
    //   if (!existingKey) {
    //     this._pressedKeys.push(key);
    //   }
    // },

    // keyOff(key: number) {
    //   const filteredKeys = this.pressedKeys.filter((it) => it !== key);
    //   this._pressedKeys = filteredKeys;
    // },

    setUserVelocity(userVelocity: number) {
      this._userVelocity = userVelocity;
      storage.setValue("userVelocity", userVelocity);
    },
  },
});

// export type MidiState = {
//   connected: boolean;
//   pressedKeys: number[];
//   correctToneVelocity: number;
//   userVelocity: number;
//   useUserVelocityForAccompanying: boolean;
//   accompanyVelocity: number;
// };

// function createState() {
//   return {
//     connected: false,
//     pressedKeys: [],
//     correctToneVelocity: storage.getNumber("correctToneVelocity", 0x2f),
//     userVelocity: storage.getNumber("userVelocity", 0),
//     useUserVelocityForAccompanying: storage.getBoolean(
//       "useUserVelocityForAccompanying",
//       false
//     ),
//     accompanyVelocity: storage.getNumber("accompanyVelocity", 0x40),
//   };
// }

// const getters = {
//   connected(state): boolean {
//     return state.connected;
//   },

//   pressedKeys(state): number[] {
//     return state.pressedKeys;
//   },

//   correctToneVelocity(state): number {
//     return state.correctToneVelocity;
//   },

//   userVelocity(state): number {
//     return state.userVelocity;
//   },

//   useUserVelocityForAccompanying(state): boolean {
//     return state.useUserVelocityForAccompanying;
//   },

//   accompanyVelocity(state): number {
//     return state.accompanyVelocity;
//   },
// };

// const mutations = {
//   setCorrectToneVelocity(state, correctToneVelocity: number) {
//     state.correctToneVelocity = correctToneVelocity;
//     storage.setValue("correctToneVelocity", correctToneVelocity);
//   },

//   setUserVelocity(state, userVelocity: number) {
//     state.userVelocity = userVelocity;
//     storage.setValue("userVelocity", userVelocity);
//   },

//   setUseUserVelocityForAccompanying(
//     state,
//     useUserVelocityForAccompanying: boolean
//   ) {
//     state.useUserVelocityForAccompanying = useUserVelocityForAccompanying;
//     storage.setValue(
//       "useUserVelocityForAccompanying",
//       useUserVelocityForAccompanying
//     );
//   },

//   setAccompanyVelocity(state, accompanyVelocity: number) {
//     state.accompanyVelocity = accompanyVelocity;
//     storage.setValue("accompanyVelocity", accompanyVelocity);
//   },
// };

// const actions = {
//   notifyConnected({ commit }: ActionContext<MidiState, RootState>) {
//     commit("setPressedKeys", []);
//     commit("setConnected", true);
//   },

//   notifyDisconnected({ commit }: ActionContext<MidiState, RootState>) {
//     commit("setPressedKeys", []);
//     commit("setConnected", false);
//   },

//   clearPressedKeys({ commit }: ActionContext<MidiState, RootState>) {
//     commit("setPressedKeys", []);
//   },
// };

// export const midiModule: Module<MidiState, RootState> = {
//   state: () => createState(),
//   getters,
//   mutations,
//   actions,
//   // namespaced: true,
// };

// export function midi(store: Store<RootState>) {
//   return (store.state as RootState).midi;
// }
