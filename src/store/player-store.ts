import _ from "lodash";
import { defineStore } from "pinia";
import { Instrument, Measure, NoteGroup, PageData } from "../utils/parser/song.data";
// import { Instrument, VerticalGroup } from "../utils/SongParser";

export type PlayerType = "computer" | "human";

// export type VirtualOnKeys = { [staff: number]: VirtualOnKeyEntry };
// export type VirtualOnKeyEntry = { [key: string]: VirtualOnKeyData };
// export type VirtualOnKeyData = { time: number; instrument: Instrument };

export const usePlayerStore = defineStore("player", {
  state: () => ({
    _player: "computer" as PlayerType,
    _instruments: [] as Instrument[],
    _selectedInstrument: null as Instrument | null,
    _practiceLeftHand: true,
    _practiceRightHand: true,
    _autoAccompany: true,
    _measures: [] as Measure[],
    _groups: [] as NoteGroup[],
    _pageData: {} as PageData,
    _bpm: 0,
    _position: 0,
    _playing: false,
    _pressedKeys: [] as number[],
    _startBlock: undefined as number | undefined,
    _endBlock: undefined as number | undefined,
    _playSpeed: 1,
    // _virtualOnKeys: {} as VirtualOnKeys,
  }),

  getters: {
    player(state): PlayerType {
      return state._player;
    },

    instruments(state): Instrument[] {
      return state._instruments;
    },

    selectedInstrument(state): Instrument | null {
      return state._selectedInstrument;
    },

    practiceLeftHand(state): boolean {
      return state._practiceLeftHand;
    },

    practiceRightHand(state): boolean {
      return state._practiceRightHand;
    },

    autoAccompany(state): boolean {
      return state._autoAccompany;
    },

    measures(state): Measure[] {
      return state._measures;
    },

    groups(state): NoteGroup[] {
      return state._groups;
    },

    pageData(state): PageData {
      return state._pageData;
    },

    bpm(state): number {
      return state._bpm;
    },

    position(state): number {
      return state._position;
    },

    playing(state): boolean {
      return state._playing;
    },

    pressedKeys(state): number[] {
      return state._pressedKeys;
    },

    startBlock(state): number | undefined {
      return state._startBlock;
    },

    endBlock(state): number | undefined {
      return state._endBlock;
    },

    playSpeed(state): number {
      return state._playSpeed;
    },

    // virtualOnKeys(state): VirtualOnKeys {
    //   return state._virtualOnKeys;
    // },
  },

  actions: {
    setPlayer(player: PlayerType): void {
      this._player = player;
    },

    setInstruments(instruments: Instrument[]): void {
      this._instruments = instruments;
    },

    setSelectedInstrument(instrument: Instrument | null): void {
      this._selectedInstrument = instrument;
    },

    setPracticeLeftHand(practiceLeftHand: boolean): void {
      this._practiceLeftHand = practiceLeftHand;
    },

    setPracticeRightHand(practiceRightHand: boolean): void {
      this._practiceRightHand = practiceRightHand;
    },

    setAutoAccompany(autoAccompany: boolean): void {
      this._autoAccompany = autoAccompany;
    },

    setMeasures(measures: Measure[]): void {
      this._measures = measures;
    },

    setGroups(groups: NoteGroup[]): void {
      this._groups = groups;
    },

    setPageData(pageData: PageData): void {
      this._pageData = pageData;
    },

    setBpm(bpm: number): void {
      this._bpm = bpm;
    },

    setPosition(position: number): void {
      this._position = position;
    },

    setPlaying(playing: boolean): void {
      this._playing = playing;
    },

    clearPressedKeys(): void {
      this._pressedKeys = [];
    },

    setPressedKey(key: number) {
      if (!this._pressedKeys.includes(key)) {
        this._pressedKeys.push(key);
      }
    },

    removePressedKey(key: number) {
      _.pull(this._pressedKeys, key);
    },

    setStartBlock(startBlock: number | undefined) {
      this._startBlock = startBlock;
    },

    setEndBlock(endBlock: number | undefined) {
      this._endBlock = endBlock;
    },

    setPlaySpeed(playSpeed: number) {
      this._playSpeed = playSpeed;
    },

    // resetVirtualOnKeys(staffs: number[]): void {
    //   this._virtualOnKeys = {};
    //   staffs.forEach((staff) => (this._virtualOnKeys[staff] = {}));
    // },

    // setVirtualOnKey(staff: number, key: string, time: number, instrument: Instrument) {
    //   this._virtualOnKeys[staff][key] = { time, instrument };
    // },

    // removeVirtualOnKey(staff: number, key: string) {
    //   delete this._virtualOnKeys[staff][key];
    // },
  },
});
