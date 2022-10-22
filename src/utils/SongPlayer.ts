import { difference, isEmpty } from "lodash";
import { midiService } from "../services/midi-service";
import { usePlayerStore } from "../store/player-store";
import { NoteGroup } from "./parser/song.data";

function initInstruments() {``
  const player = usePlayerStore();
  // player.instruments.forEach((it) => {
  //   midiService.initInstruments(it);
  // });
}

function triggerKeys() {
  const player = usePlayerStore();

  if (!player.playing) {
    return;
  }

  const practiceStaves = getPracticeStaves();
  const group = player.groups[player.position];

  const pressedKeys = player.pressedKeys;
  const requiredKeys = calcRequiredKeys(practiceStaves, group);
  player.setRequiredKeys(requiredKeys);

  if (pressedAndRequiredKeysMismatch(requiredKeys, pressedKeys)) {
    return;
  }
  player.clearPressedKeys();

  triggerOffNotes(practiceStaves);
  triggerComputerKeys(practiceStaves);

  awaitNextGroup(group);
}

function triggerOffNotes(practiceStaves: number[]) {
  const player = usePlayerStore();
  const group = player.groups[player.position];

  group.instruments.forEach((instrumentStaves) => {
    const instrument = instrumentStaves.instrument;

    instrumentStaves.staves.forEach((staff) => {
      if (instrument !== player.selectedInstrument || !practiceStaves.includes(staff.staffNumber)) {
        staff.notesOff
          .forEach((noteNumber) => {
            midiService.release(noteNumber, instrumentStaves.instrument); //, AvailableMidiInstruments[0], 0);
          });
      }
    });
  });
}

function triggerComputerKeys(practiceStaves: number[]) {
  const player = usePlayerStore();
  const group = player.groups[player.position];

  group.instruments.forEach((instrumentStaves) => {
    const instrument = instrumentStaves.instrument;

    instrumentStaves.staves.forEach((staff) => {
      if (instrument !== player.selectedInstrument || !practiceStaves.includes(staff.staffNumber)) {
        staff.notes
          .filter((note) => !note.rest && !note.tieStop)
          .forEach((note) => {
            midiService.play(note.noteNumber, 0x40, instrumentStaves.instrument); //, AvailableMidiInstruments[0], 0);
          });
      }
    });
  });
}

function awaitNextGroup(group: NoteGroup) {
  const player = usePlayerStore();

  if (player.player !== "computer") {
    advancePosition();
  }
  const divisions = group.measure.divisions;

  if (player.playing) {
    // const timeoutDelay = playerHasKeys && !computerHasKeys ? 0 : 1 / group.tempo * 60000 * group.duration / divisions * player.playSpeed;
    const timeoutDelay = 1 / group.tempo * 60000 * group.duration / divisions * player.playSpeed;
    player.setPlayingTimeoutId(setTimeout(() => {
      if (player.player === "computer") {
        advancePosition();
      }

      player.setPlayingTimeoutId(null);
      triggerKeys();
    }, timeoutDelay));
  }
}

function advancePosition() {
  const player = usePlayerStore();
  if (!player.playing) {
    return;
  }

  if (player.position === player.endBlock) {
    player.setPosition(player.startBlock ?? 0);
  } else {
    player.setPosition(player.position + 1);
  }

  if (player.position === player.groups.length) {
    stop();
  }
}

function play() {
  const player = usePlayerStore();
  if (player.playing) {
    return;
  }
  player.setPlaying(true);
  triggerKeys();
}

function pause() {
  const player = usePlayerStore();
  player.setPlaying(false);
  // player.clearPressedKeys();
  midiService.resetDevice();
}

function stop() {
  const player = usePlayerStore();
  pause();
  player.setPosition(player.startBlock ?? 0)
}

function getPracticeStaves(): number[] {
  const player = usePlayerStore();
  if (player.player === "computer") {
    return [];
  }
  const staffCount = player.selectedInstrument!!.staffCount;
  if (staffCount === 1 || (player.practiceLeftHand && player.practiceRightHand)) {
    return [...Array(staffCount).keys()];
  }

  if (player.practiceLeftHand) {
    return [1];
  }

  return [0];
}

function calcRequiredKeys(practiceStaves: number[], group: NoteGroup): number[] {
  const player = usePlayerStore();

  const instrumentStaves = group.instruments.find((it) => it.instrument === player.selectedInstrument)
  let requiredKeys: number[] = [];
  if (instrumentStaves) {
    requiredKeys = instrumentStaves.staves
      .filter((it) => practiceStaves.includes(it.staffNumber))
      .flatMap((staff) => staff.notes)
      .filter((note) => !note.rest && !note.tieStop)
      .map((note) => note.noteNumber)
  }
  return requiredKeys;
}

function pressedAndRequiredKeysMismatch(requiredKeys: number[], pressedKeys: number[]): boolean {
  return requiredKeys.length > 0 && !isEmpty(difference(requiredKeys, pressedKeys));
}

export const SongPlayer = {
  play,
  pause,
  stop,
  triggerKeys,
  initInstruments,
};
