import _ from "lodash";
import { defineStore } from "pinia";
import { Instrument, Measure, NoteGroup, PageData } from "../utils/parser/song.data";
import { storage } from "../utils/local_storage";

export type PlayerType = "computer" | "human";

export type LoopBlock = {
  groupId: number;
  orderId: number;
};

// export type VirtualOnKeys = { [staff: number]: VirtualOnKeyEntry };
// export type VirtualOnKeyEntry = { [key: string]: VirtualOnKeyData };
// export type VirtualOnKeyData = { time: number; instrument: Instrument };

export const usePlayerStore = defineStore("player", {
  state: () => ({
    _player: "human" as PlayerType,
    _instruments: [] as Instrument[],
    _selectedInstrument: null as Instrument | null,
    _practiceLeftHand: true,
    _practiceRightHand: true,
    _autoAccompany: true,
    _measures: [] as Measure[],
    _groups: [] as NoteGroup[],
    _groupOrder: [] as number[],
    _pageData: {} as PageData,
    _bpm: 0,
    _position: 0,
    _playing: false,
    _pressedKeys: [] as number[],
    _startBlock: undefined as LoopBlock | undefined,
    _endBlock: undefined as LoopBlock | undefined,
    _playSpeed: 1,
    _playingTimeoutId: null as NodeJS.Timeout | null,
    _requiredKeys: {} as { [key: string]: boolean },
    _playerVelocity: storage.getNumber("playerVelocity", 0),
    _accompanyVelocityAsPlayer: storage.getBoolean("accompanyVelocityAsPlayer", false),
    _accompanyVelocity: storage.getNumber("accompanyVelocity", 0x40),
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

    groupOrder(state): number[] {
      return state._groupOrder;
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

    startBlock(state): LoopBlock | undefined {
      return state._startBlock;
    },

    endBlock(state): LoopBlock | undefined {
      return state._endBlock;
    },

    playSpeed(state): number {
      return state._playSpeed;
    },

    playingTimeoutId(state): NodeJS.Timeout | null {
      return state._playingTimeoutId;
    },

    requiredKeys(state): { [key: string]: boolean } {
      return state._requiredKeys;
    },

    playerVelocity(state): number {
      return state._playerVelocity;
    },

    accompanyVeolcityAsPlayer(state): boolean {
      return state._accompanyVelocityAsPlayer;
    },

    accompanyVelocity(state): number {
      return state._accompanyVelocity;
    },
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

    setGroupOrder(groupOrder: number[]): void {
      this._groupOrder = groupOrder;
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

    setStartBlock(startBlock: LoopBlock | undefined) {
      this._startBlock = startBlock;
    },

    setEndBlock(endBlock: LoopBlock | undefined) {
      this._endBlock = endBlock;
    },

    setPlaySpeed(playSpeed: number) {
      this._playSpeed = playSpeed;
    },

    setPlayingTimeoutId(playingTimeoutId: NodeJS.Timeout | null) {
      this._playingTimeoutId = playingTimeoutId;
    },

    setRequiredKeys(requiredKeys: number[]) {
      const keys = {} as { [key: string]: boolean };
      requiredKeys.forEach((it) => keys[it] = true);
      this._requiredKeys = keys;
    },

    setPlayerVelocity(playerVelocity: number) {
      this._playerVelocity = playerVelocity;
      storage.setValue("playerVelocity", playerVelocity);
    },

    setAccompanyVelocityAsPlayer(accompanyVelocityAsPlayer: boolean) {
      this._accompanyVelocityAsPlayer = accompanyVelocityAsPlayer;
      storage.setValue("accompanyVelocityAsPlayer", accompanyVelocityAsPlayer);
    },

    setAccompanyVelocity(accompanyVelocity: number) {
      this._accompanyVelocity = accompanyVelocity;
      storage.setValue("accompanyVelocity", accompanyVelocity);
    },
  },
});
