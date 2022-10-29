import { number } from "yargs";

export type SongData = {
  pageData: PageData;
  instruments: Instrument[];
  measures: Measure[];
  groups: NoteGroup[];
  groupOrder: number[];
  // sustainPresses: List<SustainPress>,
  // divisions: Int,
  // tempoFactor: Float
};

export type PageData = {
  scaling: number;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
  pageMargins: { [type: string]: PageMargins }
};

export type PageMargins = {
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
}

export type Instrument = {
  id: string;
  name: string;
  index: number;
  staffCount: number;
};

export type NoteGroup = {
  id: number,
  time: number,
  duration: number,
  instruments: InstrumentStaves[];
  pos: Point,
  dimension: Dimension,
  measure: Measure,
  tempo: number,
  repeatStartNumber: number | undefined,
  repeatStart: boolean,
  repeatEnd: boolean,
  sustain: SustainType | undefined,
}

export enum SustainType {
  On, Off
}

export type InstrumentStaves = {
  instrument: Instrument;
  staves: Staff[];
}

export type Staff = {
  staffNumber: number;
  notes: Note[];
  notesOff: number[];
}

export type Point = {
  x: number;
  y: number;
}

export type Dimension = {
  width: number;
  height: number;
}

export type Note = {
  duration: number;
  noteNumber: number;
  tieStop: boolean;
  rest: boolean;
  restOnWholeMeasure: boolean;
  pos: Point;
}

export type Measure = {
  number: string;
  pos: Point;
  dimension: Dimension;
  pageNumber: number;
  divisions: number;
  staveLayouts: StaveLayouts;
}

export type StaveLayouts = {[instrumentId: string]: number[]};
