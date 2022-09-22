export type SongData = {
  pageData: SongPageData;
  instruments: InstrumentData[];
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

export type InstrumentData = {
  id: string;
  name: string;
  index: number;
};

export type NoteGroup = {
  time: number,
  duration: number,
  instruments: { [key: string]: Note[] }
  // minPos: Point,
  // maxPos: Point,
  // pageNumber: number,
  measureNumber: number,
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
