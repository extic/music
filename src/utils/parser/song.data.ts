export type SongData = {
  pageData: SongPageData;
  instruments: Instrument[];
  groups: NoteGroup[],
  // sustainPresses: List<SustainPress>,
  // divisions: Int,
  // tempoFactor: Float
};

export type SongPageData = {
  scaling: number;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
};

export type Instrument = {
  id: string;
  name: string;
  index: number;
  staffCount: number;
};

export type NoteGroup = {
  time: number,
  duration: number,
  instruments: InstrumentStaves[];
  // minPos: Point,
  // maxPos: Point,
  // pageNumber: number,
  measureNumber: number,
}

export type InstrumentStaves = {
  instrument: Instrument;
  staves: Staff[];
}

export type Staff = {
  staffNumber: number;
  notes: Note[];
}

export type Point = {
  x: number;
  y: number;
}

export type Note = {
  duration: number;
  noteNumber: number;
  // hand: number;
  // tieStop: boolean;
  rest: boolean;
}
