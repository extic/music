import { Instrument, InstrumentStaves, Note, NoteGroup, Point, SongData, PageData, Staff, PageMargins, Measure, StaveLayouts } from "./song.data";
import fs from "fs";
import { AccidentalOverrides, calcNoteNumber } from "./note-number.parser";
import { findAll, findOne, findOneAsNumber, findAttr, findOneAsString, findOptionalOneAsInt, findAttrInt, findOneAsInt } from "./xml.utils";
import { forEach, last, max, min, minBy, range, zip } from "lodash";
import { Song } from "../../services/song-serializer.service";

type ParsedMeasure = {
  number: number;
  width: number;
  newPage: boolean;
  newSystem: boolean;
  systemMarginLeft: number;
  systemMarginRight: number;
  topSystemDistance: number;
  systemDistance: number;
  staveLayouts: StaveLayouts;
  divisions: number;
}

type MeasureParsingContext = {
  groupId: number;
  prevTime: number;
  currTime: number;
  key: number;
  instruments: Instrument[];
  instrument: Instrument;
  measure: Measure;
  tempo: number;
}

type ParsedNote = { note: Note, chord: boolean, staffNumber: number, pos: Point };

export function parseSong(song: Song): SongData {
  const dom = readSong(song);

  const scorePartwise = dom.documentElement;
  const pageData = readPageData(scorePartwise);
  const instruments = readInstruments(scorePartwise);
  const measures = parseMeasures(scorePartwise, instruments, pageData);
  const groups = parseGroups(scorePartwise, instruments, measures);

  pageData.pageCount = (max(measures.map((it) => it.pageNumber)) ?? 0) + 1;

  return {
    pageData,
    instruments,
    measures,
    groups,
  } as SongData;
}

export function printDebug(songData: SongData) {
  songData.groups.forEach((group) => {
    console.log(`Group ${group.id}, time=${group.time}, duration=${group.duration}, measure=${group.measure.number}, tempo=${group.tempo}, divisions=${group.measure.divisions}`)
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

function readPageData(scorePartwise: Element): PageData {
  const defaults = findOne(scorePartwise, "defaults");
  const scaling = findOne(defaults, "scaling");
  const millimeters = findOneAsNumber(scaling, "millimeters");
  const tenths = findOneAsNumber(scaling, "tenths");
  const pageLayout = findOne(defaults, "page-layout");
  const pageWidth = findOneAsNumber(pageLayout, "page-width");
  const pageHeight = findOneAsNumber(pageLayout, "page-height");
  const pageMargins = readPageMargins(pageLayout);

  const dpi = 200;
  return {
    scaling: (millimeters / tenths) * (dpi / 25.4),
    pageCount: 0, //will be calculated later from the measures
    pageWidth,
    pageHeight,
    pageMargins,
  };
}

function readPageMargins(pageLayout: Element): { [type: string]: PageMargins} {
  const pageMargins: { [type: string]: PageMargins} = {};

  findAll(pageLayout, "page-margins").forEach((margins) => {
    const type = findAttr(margins, "type");
    pageMargins[type] = {
      leftMargin: findOneAsNumber(margins, "left-margin"),
      rightMargin: findOneAsNumber(margins, "right-margin"),
      topMargin: findOneAsNumber(margins, "top-margin"),
      bottomMargin: findOneAsNumber(margins, "bottom-margin"),
    };
  });

  return pageMargins;
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

      return {
        id,
        name: findOneAsString(scorePart, "part-name"),
        index,
        staffCount,
      } as Instrument
    })
}

function parseMeasures(scorePartwise: Element, instruments: Instrument[], pageData: PageData): Measure[] {
  const parsedMeasures: ParsedMeasure[] = [];

  instruments.forEach((currInstrument) => {
    const part = findOne(scorePartwise, `part[id=${currInstrument.id}]`)
    findAll(part, 'measure').forEach((measureElement, index) => {
      parseMeasure(currInstrument, measureElement, parsedMeasures, index);
    });
  });

  return convertToMeasures(parsedMeasures, pageData);
}

function parseMeasure(instrument: Instrument, measureElement: Element, parsedMeasures: ParsedMeasure[], measureNumber: number) {
  const width = findAttrInt(measureElement, "width");
  const print = findOne(measureElement, "print");
  const attributes = findOne(measureElement, "attributes");

  let newPage = false;
  let newSystem = false;
  let topSystemDistance = 0;
  let systemDistance = 0;
  let systemMarginLeft = 0;
  let systemMarginRight = 0;
  let divisions = 0;

  if (print) {
    newPage = print.getAttribute("new-page") === "yes";
    newSystem = print.getAttribute("new-system") === "yes";

    const systemLayout = print.querySelector("system-layout");
    if (systemLayout) {
      topSystemDistance = findOptionalOneAsInt(systemLayout, "top-system-distance") ?? 0;
      systemDistance = findOptionalOneAsInt(systemLayout, "system-distance") ?? 0;
      const systemMargins = findOne(systemLayout, "system-margins");
      systemMarginLeft = findOneAsNumber(systemMargins, "left-margin");
      systemMarginRight = findOneAsNumber(systemMargins, "right-margin");
    }
  }

  if (attributes) {
    divisions = findOptionalOneAsInt(attributes, "divisions") ?? 0;
  }

  let parsedMeasure = parsedMeasures.find((it) => it.number === measureNumber);
  if (!parsedMeasure) {
    parsedMeasure = {
      number: measureNumber,
      width,
      newPage,
      newSystem,
      systemMarginLeft,
      systemMarginRight,
      topSystemDistance,
      systemDistance,
      staveLayouts: {},
      divisions,
    };
    parsedMeasures.push(parsedMeasure);
  }

  parsedMeasure.staveLayouts[instrument.id] = range(instrument.staffCount).map((staffNumber) => {
    if (print) {
      const staffLayout = print.querySelector(`staff-layout[number="${staffNumber + 1}"]`)
      if (staffLayout) {
        return findOneAsInt(staffLayout, 'staff-distance');
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  });
}

function convertToMeasures(parsedMeasures: ParsedMeasure[], pageData: PageData): Measure[] {
  let lastFilledStaveLayouts: StaveLayouts = {};
  let pageNumber = 0;
  let divisions = 0;
  const currPos: Point = { x: 0, y: 0 };

  let lastMeasure: Measure | undefined = undefined;
  return parsedMeasures.map((parsedMeasure) => {
    if (parsedMeasure.newPage) {
      pageNumber++;
    }

    if (parsedMeasure.divisions !== 0) {
      divisions = parsedMeasure.divisions;
    }

    if (parsedMeasure.newPage || parsedMeasure.newSystem || parsedMeasure.number === 0) {
      lastFilledStaveLayouts = parsedMeasure.staveLayouts;

      const pageMarginsType = pageNumber % 2 == 0 ? 'even' : 'odd';
      const pageMargins = pageData.pageMargins[pageMarginsType] ?? pageData.pageMargins['both']

      currPos.x = pageMargins.leftMargin + parsedMeasure.systemMarginLeft;

      if (parsedMeasure.newPage || parsedMeasure.number === 0) {
        currPos.y = pageMargins.topMargin + parsedMeasure.topSystemDistance + pageNumber * pageData.pageHeight;
      } else {
        currPos.y += parsedMeasure.systemDistance + lastMeasure!!.dimension.height;
      }
    }

    const staffHeights = Object.values(lastFilledStaveLayouts)
      .flatMap((it) => it)
      .map((it) => it + 4 * 10)
      .reduce((acc, val) => acc + val, 0);

    const measure = {
      number: parsedMeasure.number,
      pos: { x: currPos.x, y: currPos.y },
      dimension: { width: parsedMeasure.width, height: staffHeights },
      pageNumber,
      divisions,
      staveLayouts: lastFilledStaveLayouts,
    } as Measure;

    currPos.x += parsedMeasure.width;

    lastMeasure = measure;
    return measure;
  })
}

function parseGroups(scorePartwise: Element, instruments: Instrument[], measures: Measure[]): NoteGroup[] {
  const groups: NoteGroup[] = []

  instruments.forEach((currInstrument) => {
    const part = findOne(scorePartwise, `part[id=${currInstrument.id}]`)
    const context = { groupId: 0, prevTime: 0, currTime: 0, instruments, instrument: currInstrument, tempo: 0 } as MeasureParsingContext;

    measures.forEach((measure) => {
      const measureElement = findOne(part, `measure[number="${measure.number + 1}"]`);
      context.key = getMeasureKey(measureElement) ?? context.key;
      context.measure = measure;

      parseMeasureNotes(groups, measureElement, context);
    })
  });

  calcGroupTiming(groups);
  calcGroupPositioning(groups);
  calcGroupTempos(groups);

  return groups;
}

function parseMeasureNotes(groups: NoteGroup[], measureElement: Element, context: MeasureParsingContext) {
  const accidentalOverrides: AccidentalOverrides = {};

  const nodes = ([...measureElement.childNodes] as Element[]).filter((it) => it.nodeName !== '#text');

  nodes.map((node) => {
    switch (node.nodeName) {
      case 'note': {
        const parsedNote = parseNote(node, context, accidentalOverrides);
        if (!parsedNote) {
          return;
        }
        if (parsedNote.chord) {
          context.currTime = context.prevTime;
        }

        let currGroup = groups.find((it) => it.time === context.currTime);
        if (!currGroup) {
          currGroup = createNewGroup(context)
          const previousGroupIndex = findPreviousGroupIndex(groups, context.currTime);
          if (previousGroupIndex === -1) {
            groups.push(currGroup);
          } else {
            groups.splice(previousGroupIndex + 1, 0, currGroup);
          }
        }

        currGroup.instruments[context.instrument.index].staves[parsedNote.staffNumber].notes.push(parsedNote.note);

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

      case 'direction': {
        const sound = node.querySelector('sound');
        if (sound) {
          const tempo = sound.getAttribute("tempo");
          if (tempo) {
            context.tempo = parseInt(tempo, 10);
          }
        }
        break;
      }
    }
  })
}

function parseNote(noteElement: Element, context: MeasureParsingContext, accidentalOverrides: AccidentalOverrides): ParsedNote | undefined {
  const grace = !!noteElement.querySelector('grace');
  if (grace) {
    return;
  }

  const rest = noteElement.querySelector('rest');
  const restOnWholeMeasure = rest ? (rest.getAttribute('measure') === 'yes') : false;
  const duration = findOneAsNumber(noteElement, 'duration');
  const chord = !!noteElement.querySelector('chord');
  const staffNumber = findOptionalOneAsInt(noteElement, 'staff') ?? 1;
  const tie = noteElement.querySelector('tie');
  const tieStop = tie ? findAttr(tie, 'type') === 'stop' : false;
  const posX = findAttrInt(noteElement, 'default-x')
  const posY = findAttrInt(noteElement, 'default-y')

  return {
    note: {
      duration,
      noteNumber: rest ? 0 : calcNoteNumber(noteElement, context.key, accidentalOverrides),
      rest: !!rest,
      restOnWholeMeasure,
      tieStop,
      pos: { x: posX, y: posY },
    },
    chord,
    staffNumber: staffNumber - 1,
    pos: { x: 0, y: 0 },
  };
}

function createNewGroup(context: MeasureParsingContext): NoteGroup {
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

  return {
    id: context.groupId++,
    time: context.currTime,
    duration: 100000,
    instruments: instrumentStavesList,
    measure: context.measure,
    pos: { x : 0, y: 0 },
    dimension: {
      width: 0,
      height: 0,
    },
    tempo: context.tempo,
  }
}

function findPreviousGroupIndex(groups: NoteGroup[], time: number): number {
  const remaining = groups.filter((it) => it.time < time)
  return remaining.length - 1;
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

function calcGroupTiming(groups: NoteGroup[]) {
  for (let i = 0; i < groups.length - 1; i++) {
    const currGroup = groups[i];
    const nextGroup = groups[i + 1];
    currGroup.duration = nextGroup.time - currGroup.time;
  }
  const lastGroup = last(groups)!!;
  const allNotes = lastGroup.instruments.flatMap((it) => it.staves).flatMap((it) => it.notes);
  lastGroup.duration = minBy(allNotes, (it) => it.duration)?.duration ?? 0;
}

function calcGroupPositioning(groups: NoteGroup[]) {
  groups.forEach((group) => {
    const notes = group.instruments.flatMap((it) => it.staves).flatMap((it) => it.notes)
    const minX = minBy(notes, ((it) => it.pos.x))?.pos.x ?? 0;

    group.pos = {
      x: minX + group.measure.pos.x + 3,
      y: group.measure.pos.y - 30,
    };
    group.dimension = {
      width: 26,
      height: group.measure.dimension.height + 60,
    }
  })
}

function calcGroupTempos(groups: NoteGroup[]) {
  let lastTempo = 100;
  groups.forEach((group) => {
    if (group.tempo !== 0) {
      lastTempo = group.tempo;
    } else {
      group.tempo = lastTempo;
    }
  });
}
