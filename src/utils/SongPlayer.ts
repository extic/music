import _, { isEmpty } from "lodash";
import { it } from "node:test";
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

  const playerHasKeys = !isEmpty(requiredKeys.length);
  triggerOffNotes(practiceStaves);
  const computerHasKeys = triggerComputerKeys(false, practiceStaves);


  awaitNextGroup(group, playerHasKeys, computerHasKeys);

  // if (player.player === "computer") {
  //   return;
  // }


  // const requiredKeys = practiceStaves
  //   .flatMap((staff) => group.notes[staff])
  //   .filter((it) => !it.isRest)
  //   .map((it) => it.tone);
  // const pressedKeys = player.pressedKeys;

  // console.log(player.pressedKeys, requiredKeys);

  // if (requiredKeys.length !== pressedKeys.length || !_.isEmpty(_.difference(requiredKeys, pressedKeys))) {
  //   return;
  // }

  // player.clearPressedKeys();

  // const playerHasKeys = requiredKeys.length > 0;
  // triggerComputerKeys(playerHasKeys, practiceStaves);
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

function triggerComputerKeys(playerHasKeys: boolean, practiceStaves: number[]): boolean {
  const player = usePlayerStore();
  const group = player.groups[player.position];
  let computerHasKeys = false;

  group.instruments.forEach((instrumentStaves) => {
    const instrument = instrumentStaves.instrument;

    instrumentStaves.staves.forEach((staff) => {
      if (instrument !== player.selectedInstrument || !practiceStaves.includes(staff.staffNumber)) {
        staff.notes
          .filter((note) => !note.rest && !note.tieStop)
          .forEach((note) => {
            computerHasKeys = true;
            midiService.play(note.noteNumber, 0x40, instrumentStaves.instrument); //, AvailableMidiInstruments[0], 0);
          });
      }
    });
  });

  return computerHasKeys;
}

function awaitNextGroup(group: NoteGroup, playerHasKeys: boolean, computerHasKeys: boolean) {
  const player = usePlayerStore();

  if (player.player !== "computer") {
    advancePosition();
  }
  // Object.values(group.instruments).forEach((instrumentNotes) => {
  //   const instrument = instrumentNotes.instrument;

  // })

  // const staffNotes = group.notes;
  // let computerHasKeys = false;
  // player.instruments.forEach((instrument, index) => {
  //   instrument.staffIndexes
  //     .filter((it) => !practiceStaves.includes(it))
  //     .forEach((staffIndex) => {
  //       staffNotes[staffIndex]
  //         .filter((note) => !note.isRest && !note.isTied)
  //         .forEach((note) => {
  //           computerHasKeys = true;
  //           player.setVirtualOnKey(staffIndex, note.tone.toString(), note.length, note.instrument);
  //           midiService.play(note.tone, 0x40, note.instrument); //, AvailableMidiInstruments[0], 0);
  //         });
  //     });
  // });

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

  // if (player.playing) {
  //   const delayCoefficient = -player.bpm * 36.66 + 5866;
  //   const timeoutDelay = playerHasKeys && !computerHasKeys ? 0 : group.length * delayCoefficient;
  //   setTimeout(() => {
  //     advancePosition();
  //   }, timeoutDelay);
  // }
}

function advancePosition() {
  const player = usePlayerStore();
  // const group = player.groups[player.position];
  // updateVirtualOnKeysTime(group.length);
  // console.log(player.virtualOnKeys);

  // // console.log("advancePosition", player.playing);
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

function updateVirtualOnKeysTime(amount: number) {
  // const player = usePlayerStore();
  // Object.entries(player.virtualOnKeys).forEach(([staff, virtualOnKeyEntry]) => {
  //   Object.entries(virtualOnKeyEntry).forEach(([key, timeAndInstrument]) => {
  //     timeAndInstrument.time -= amount;
  //     if (timeAndInstrument.time <= 0) {
  //       player.removeVirtualOnKey(+staff, key);
  //       midiService.release(+key, timeAndInstrument.instrument);
  //     }
  //   });
  // });
}

function play() {
  const player = usePlayerStore();
  if (player.playing) {
    return;
  }
  player.setPlaying(true);
  // player.resetVirtualOnKeys(player.instruments.flatMap((it) => it.staffIndexes));
  triggerKeys();
}

function pause() {
  const player = usePlayerStore();
  player.setPlaying(false);
  // player.clearPressedKeys();
  // player.resetVirtualOnKeys([]);
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
  // console.log("requiredKeys", requiredKeys);
  return requiredKeys;
}

function pressedAndRequiredKeysMismatch(requiredKeys: number[], pressedKeys: number[]): boolean {
  // console.log(requiredKeys, _.difference(requiredKeys, pressedKeys));
  // return requiredKeys.length > 0 && requiredKeys.length !== pressedKeys.length || !_.isEmpty(_.difference(requiredKeys, pressedKeys));
  return requiredKeys.length > 0 && !_.isEmpty(_.difference(requiredKeys, pressedKeys));
}

export const SongPlayer = {
  play,
  pause,
  stop,
  triggerKeys,
  initInstruments,
};
