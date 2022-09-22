import { findOne, findOneAsString, findOneAsNumber, findOptionalOneAsString } from "./xml.utils";

export type AccidentalOverrides = {
  [key: string]: number;
};

export function calcNoteNumber(noteElement: Element, key: number, accidentalOverrides: AccidentalOverrides): number {
  const pitch = findOne(noteElement, "pitch");
  const step = findOneAsString(pitch, "step");
  const octave = findOneAsNumber(pitch, "octave");
  const noteName = `${step}${octave}`;
  const noteAccidental = findOptionalOneAsString(noteElement, "accidental");

  let { noteNumber, accidental } = calcNoteNumberAndAccidental(key, step);

  if (noteAccidental) {
    switch (noteAccidental) {
      case "double_sharp":
        accidental = 2;
        break;
      case "sharp":
        accidental = 1;
        break;
      case "natural":
        accidental = 0;
        break;
      case "flat":
        accidental = -1;
        break;
      case "double_flat":
        accidental = -2;
        break;
    }
    accidentalOverrides[noteName] = accidental;
  } else {
    const accidentalOverride = accidentalOverrides[noteName];
    if (accidentalOverride) {
      accidental = accidentalOverride;
    }
  }

  return noteNumber + accidental + (octave + 1) * 12;
}

type NoteNumberAndAccidental = {
  noteNumber: number;
  accidental: number;
};

function calcNoteNumberAndAccidental(
  key: number,
  step: string
): NoteNumberAndAccidental {
  switch (step) {
    case "C":
      return determineForStep(key, 0, 2, -6);
    case "D":
      return determineForStep(key, 2, 4, -4);
    case "E":
      return determineForStep(key, 4, 6, -2);
    case "F":
      return determineForStep(key, 5, 1, -7);
    case "G":
      return determineForStep(key, 7, 3, -5);
    case "A":
      return determineForStep(key, 9, 5, -3);
    case "B":
      return determineForStep(key, 11, 7, -1);
  }
  throw Error(`Unknown note '${step}'`);
}

function determineForStep(
  key: number,
  noteNumber: number,
  keyUp: number,
  keyDown: number
): NoteNumberAndAccidental {
  let accidental = 0;
  if (key > 2) {
    accidental = 1;
  }
  if (key < -6) {
    accidental = -1;
  }
  return { noteNumber, accidental };
}
