import _ from "lodash";
import { midiService } from "../services/midi-service";
import { usePlayerStore } from "../store/player-store";

function initInstruments() {
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

  if (player.player === "computer") {
    triggerComputerKeys(false, practiceStaves);
    return;
  }

  const group = player.groups[player.position];
  // const requiredKeys = practiceStaves
  //   .flatMap((staff) => group.notes[staff])
  //   .filter((it) => !it.isRest)
  //   .map((it) => it.tone);
  // const pressedKeys = player.pressedKeys;

  // console.log(player.pressedKeys, requiredKeys);

  // if (requiredKeys.length !== pressedKeys.length || !_.isEmpty(_.difference(requiredKeys, pressedKeys))) {
  //   return;
  // }

  player.clearPressedKeys();

  // const playerHasKeys = requiredKeys.length > 0;
  // triggerComputerKeys(playerHasKeys, practiceStaves);
}

function triggerComputerKeys(playerHasKeys: boolean, practiceStaves: number[]) {
  const player = usePlayerStore();
  const group = player.groups[player.position];

  group.instruments.forEach((instrumentStaves) => {
    instrumentStaves.staves.forEach((staff) => {
      staff.notes
        .filter((note) => !note.rest)
        .forEach((note) => {
          midiService.play(note.noteNumber, 0x40, instrumentStaves.instrument); //, AvailableMidiInstruments[0], 0);
        })
    })
  })

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

    if (player.playing) {
      const timeoutDelay = 100 * group.duration;
      setTimeout(() => {
        advancePosition();
      }, timeoutDelay);
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
  const group = player.groups[player.position];
  // updateVirtualOnKeysTime(group.length);
  // console.log(player.virtualOnKeys);

  // // console.log("advancePosition", player.playing);
  if (!player.playing) {
    return;
  }
  player.setPosition(player.position + 1);

  triggerKeys();
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

function stop() {
  const player = usePlayerStore();
  player.setPlaying(false);
  // player.clearPressedKeys();
  // player.resetVirtualOnKeys([]);
  midiService.resetDevice();
}

function reset() {
  const player = usePlayerStore();
  stop();
  player.setPosition(0);
}

function getPracticeStaves(): number[] {
  const player = usePlayerStore();
  if (player.player === "computer") {
    return [];
  }
  // const staffIndexes = player.selectedInstrument!!.staffIndexes;
  // if (staffIndexes.length === 1 || (player.practiceLeftHand && player.practiceRightHand)) {
  //   return staffIndexes;
  // }
  // if (player.practiceLeftHand) {
  //   return [staffIndexes[1]];
  // }
  // return [staffIndexes[0]];
  return [];
}

export const SongPlayer = {
  play,
  stop,
  reset,
  triggerKeys,
  initInstruments,
};
