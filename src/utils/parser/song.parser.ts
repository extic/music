import { Song } from "src/services/song-serializer.service";
import { Instrument, Note, NoteGroup, SongData, SongPageData } from "./song.data";
import fs from "fs";
import { calcNoteNumber } from "./note-number.parser";
import { findAll, findOne, findOneAsNumber, findAttr, findOneAsString } from "./xml.utils";

export function parseSong(song: Song): SongData {
  const dom = readSong(song);

  const scorePartwise = dom.documentElement;
  const pageData = readPageData(scorePartwise);
  const instruments = readInstruments(scorePartwise);
  const groups: NoteGroup[] = []

  instruments.forEach((instrument) => {
    const part = scorePartwise.querySelector(`part[id=${instrument.id}]`)
    if (!part) {
      throw Error(`Cannot parse musicxml, missing part data for id=${instrument.id}`);
    }
    const measures = findAll(part, 'measure');
    parseMeasures(groups, measures, instrument);
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
    Object.keys(group.instruments).forEach((instrument: string) => {
      console.log(`    Instrument ${instrument}:`);
      group.instruments[instrument].forEach((note) => {
        console.log(`        ${note.rest ? 'Rest' : 'Note ' + note.noteNumber}, duration=${note.duration}`)
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
      return {
        id: findAttr(scorePart, "id"),
        name: findOneAsString(scorePart, "part-name"),
        index
      } as Instrument
    })
}

type MeasureParsingContext = {
  prevTime: number;
  currTime: number;
}

function parseMeasures(groups: NoteGroup[], measures: Element[], instrument: Instrument) {
  const context = { prevTime: 0, currTime: 0 };

  for (let measureIndex = 0; measureIndex < measures.length; measureIndex++) {
    const measure = measures[measureIndex];

    parseMeasure(groups, measure, instrument, context, measureIndex);
  }

  return groups;
}

function parseMeasure(groups: NoteGroup[], measure: Element, instrument: Instrument, context: MeasureParsingContext, measureNumber: number) {
  const nodes = ([...measure.childNodes] as Element[]).filter((it) => it.nodeName !== '#text');

  nodes.map((node) => {
    switch (node.nodeName) {
      case 'note': {
        const parsedNote = parseNote(node);
        if (parsedNote.chord) {
          context.currTime = context.prevTime;
        }

        let currGroup = groups.find((it) => it.time === context.currTime);
        if (!currGroup) {
          currGroup = createNewGroup(context.currTime, measureNumber)
          const previousGroupIndex = findPreviousGroupIndex(groups, context.currTime);
          if (previousGroupIndex === -1) {
            groups.push(currGroup);
          } else {
            groups.splice(previousGroupIndex, 0, currGroup);
          }
        }

        if (!currGroup.instruments[instrument.id]) {
          currGroup.instruments[instrument.id] = [];
        }
        currGroup.instruments[instrument.id].push(parsedNote.note);
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

type ParsedNote = { note: Note, chord: boolean };

function parseNote(noteElement: Element): ParsedNote {
  const rest = !!noteElement.querySelector('rest');
  const duration = findOneAsNumber(noteElement, 'duration');
  const chord = !!noteElement.querySelector('chord');
  return {
    note: {
      duration,
      noteNumber: rest ? 0 : calcNoteNumber(noteElement, 0, {}),
      rest
    },
    chord
  };
}

function createNewGroup(time: number, measureNumber: number): NoteGroup {
  return {
    time,
    duration: 100000,
    instruments: {},
    measureNumber,
  }
}

function findPreviousGroupIndex(groups: NoteGroup[], time: number): number {
  const remaining = groups.filter((it) => it.time < time)
  return remaining.length;
}
