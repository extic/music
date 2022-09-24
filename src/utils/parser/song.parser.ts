import { Song } from "src/services/song-serializer.service";
import { Instrument, InstrumentStaves, Note, NoteGroup, SongData, SongPageData, Staff } from "./song.data";
import fs from "fs";
import { AccidentalOverrides, calcNoteNumber } from "./note-number.parser";
import { findAll, findOne, findOneAsNumber, findAttr, findOneAsString, findOptionalOneAsInt } from "./xml.utils";

type ParsedNote = { note: Note, chord: boolean, staffNumber: number };

export function parseSong(song: Song): SongData {
  const dom = readSong(song);

  const scorePartwise = dom.documentElement;
  const pageData = readPageData(scorePartwise);
  const instruments = readInstruments(scorePartwise);
  const groups: NoteGroup[] = []

  instruments.forEach((currInstrument) => {
    const part = scorePartwise.querySelector(`part[id=${currInstrument.id}]`)
    if (!part) {
      throw Error(`Cannot parse musicxml, missing part data for id=${currInstrument.id}`);
    }
    const measures = findAll(part, 'measure');
    parseMeasures(groups, measures, currInstrument, instruments);
  })

  return {
    pageData,
    instruments,
    groups,
  } as SongData;
}

export function printDebug(songData: SongData) {
  songData.groups.forEach((group) => {
    console.log(`Group ${group.time}, duration=${group.duration}, measure=${group.measureNumber}`)
    group.instruments.forEach((instrumentStaves) => {
      console.log(`    Instrument ${instrumentStaves.instrument.id}:`);
      instrumentStaves.staves.forEach((staff) => {
        console.log(`        Staff ${staff.staffNumber}:`);
        staff.notes.forEach((note) => {
          console.log(`            ${note.rest ? 'Rest' : 'Note ' + note.noteNumber}, duration=${note.duration}`)
        });
      })
    })
  })
}

function readSong(song: Song): Document {
  const musicXmlFile = fs
    .readdirSync(song.folder)
    .find((it) => it.endsWith(".musicxml"))!!;
  const content = fs.readFileSync(`${song.folder}/${musicXmlFile}`).toString();
  return new DOMParser().parseFromString(content, "text/xml");
}

function readPageData(scorePartwise: Element): SongPageData {
  const defaults = findOne(scorePartwise, "defaults");
  const scaling = findOne(defaults, "scaling");
  const millimeters = findOneAsNumber(scaling, "millimeters");
  const tenths = findOneAsNumber(scaling, "tenths");
  const pageLayout = findOne(defaults, "page-layout");
  const pageWidth = findOneAsNumber(pageLayout, "page-width");
  const pageHeight = findOneAsNumber(pageLayout, "page-height");

  const dpi = 200;
  return {
    scaling: (millimeters / tenths) * (dpi / 25.4),
    pageCount: 4,
    pageWidth,
    pageHeight,
  };
}

function readInstruments(scorePartwise: Element): Instrument[] {
  const partList = findOne(scorePartwise, "part-list");
  return findAll(partList, "score-part")
    .map((scorePart, index) => {
      const id = findAttr(scorePart, "id")

      const part = scorePartwise.querySelector(`part[id=${id}]`)!!;
      const firstMeasure = part.querySelector(`measure[number='1']`)!!;
      const attributes = findOne(firstMeasure, 'attributes');
      const staffCount = parseInt(attributes.querySelector('staves')?.textContent ?? '1');

      console.log(id, staffCount);

      return {
        id,
        name: findOneAsString(scorePart, "part-name"),
        index,
        staffCount,
      } as Instrument
    })
}

type MeasureParsingContext = {
  prevTime: number;
  currTime: number;
  instruments: Instrument[];
  key: number;
}

function parseMeasures(groups: NoteGroup[], measures: Element[], currInstrument: Instrument, instruments: Instrument[]) {
  const context: MeasureParsingContext = { prevTime: 0, currTime: 0, instruments, key: 0 };

  for (let measureIndex = 0; measureIndex < measures.length; measureIndex++) {
    const measure = measures[measureIndex];
    context.key = getMeasureKey(measure) ?? context.key;

    parseMeasure(groups, measure, currInstrument, context, measureIndex);
  }

  return groups;
}

function parseMeasure(groups: NoteGroup[], measure: Element, instrument: Instrument, context: MeasureParsingContext, measureNumber: number) {
  const accidentalOverrides: AccidentalOverrides = {};

  const nodes = ([...measure.childNodes] as Element[]).filter((it) => it.nodeName !== '#text');

  nodes.map((node) => {
    switch (node.nodeName) {
      case 'note': {
        const parsedNote = parseNote(node, context, accidentalOverrides);
        if (parsedNote.chord) {
          context.currTime = context.prevTime;
        }

        let currGroup = groups.find((it) => it.time === context.currTime);
        if (!currGroup) {
          currGroup = createNewGroup(context, measureNumber)
          const previousGroupIndex = findPreviousGroupIndex(groups, context.currTime);
          if (previousGroupIndex === -1) {
            groups.push(currGroup);
          } else {
            groups.splice(previousGroupIndex, 0, currGroup);
          }
        }

        currGroup.instruments[instrument.index].staves[parsedNote.staffNumber].notes.push(parsedNote.note);
        currGroup.duration = Math.min(currGroup.duration, parsedNote.note.duration);

        context.prevTime = context.currTime;
        context.currTime += parsedNote.note.duration;
        break;
      }

      case 'backup': {
        const duration = findOneAsNumber(node, 'duration');
        context.currTime -= duration;
        context.prevTime = context.currTime;
        break;
      }

      case 'forward': {
        const duration = findOneAsNumber(node, 'duration');
        context.currTime += duration;
        context.prevTime = context.currTime;
        break;
      }
    }
  })
}

function parseNote(noteElement: Element, context: MeasureParsingContext, accidentalOverrides: AccidentalOverrides): ParsedNote {
  const rest = !!noteElement.querySelector('rest');
  const duration = findOneAsNumber(noteElement, 'duration');
  const chord = !!noteElement.querySelector('chord');
  const staffNumber = findOptionalOneAsInt(noteElement, 'staff') ?? 1;
  return {
    note: {
      duration,
      noteNumber: rest ? 0 : calcNoteNumber(noteElement, context.key, accidentalOverrides),
      rest
    },
    chord,
    staffNumber: staffNumber - 1,
  };
}

function createNewGroup(context: MeasureParsingContext, measureNumber: number): NoteGroup {
  const instrumentStavesList = context.instruments.map((instrument) => {
    const instrumentStaves: InstrumentStaves = {
      instrument,
      staves: [],
    };

    for (let staffNumber = 0; staffNumber < instrument.staffCount; staffNumber++) {
      instrumentStaves.staves.push({
        notes: [],
        staffNumber,
      });
    }

    return instrumentStaves;
  });

  // const staves = Array(context.instruments.length).fill(0);
  return {
    time: context.currTime,
    duration: 100000,
    instruments: instrumentStavesList,
    measureNumber,
  }
}

function findPreviousGroupIndex(groups: NoteGroup[], time: number): number {
  const remaining = groups.filter((it) => it.time < time)
  return remaining.length;
}

function getMeasureKey(measure: Element): number | undefined {
  const attributes = measure.querySelector('attributes');
  if (!attributes) {
    return;
  }
  const key = attributes.querySelector('key');
  if (!key) {
    return;
  }
  return findOptionalOneAsInt(key, 'fifths');
}
