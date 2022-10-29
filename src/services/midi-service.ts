import { Instrument } from "../utils/parser/song.data";
import { useMidiStore } from "../store/midi-store";
//import { Instrument } from "../utils/SongParser";

import MIDIAccess = WebMidi.MIDIAccess;
import MIDIInput = WebMidi.MIDIInput;
import MIDIOutput = WebMidi.MIDIOutput;
import MIDIMessageEvent = WebMidi.MIDIMessageEvent;

export interface MidiDeviceDescriptor {
  readonly id: string;
  readonly name: string;
}

export interface MidiInstrument {
  name: string;
  code: number;
}

export const AvailableMidiInstruments: MidiInstrument[] = [
  { name: "Piano", code: 1 },
  { name: "Strings", code: 48 },
  { name: "Steel Guitar", code: 25 },
  { name: "Organ", code: 19 },
  { name: "Choir", code: 52 },
  { name: "Violin", code: 40 },
  { name: "Viola", code: 41 },
];

export interface MidiCallback {
  setConnected(connected: boolean): void;
  keyOn(key: number, velocity: number): void;
  keyOff(key: number): void;
}

let availableInputs: Map<string, MIDIInput> = new Map();
let availableOutputs: Map<string, MIDIOutput> = new Map();
let selectedInput: MIDIInput | null = null;
let selectedOutput: MIDIOutput | null = null;
let selectedInstrument: MidiInstrument = AvailableMidiInstruments[0];
let midiCallback: MidiCallback | null = null;

export const midiService = {
  availableMidiInputNames: (): MidiDeviceDescriptor[] => {
    return [...availableInputs.values()]
      .filter((it) => it.name)
      .map((it) => {
        return { id: it.id, name: it.name! };
      });
  },

  availableMidiOutputNames: (): MidiDeviceDescriptor[] => {
    return [...availableOutputs.values()]
      .filter((it) => it.name)
      .map((it) => {
        return { id: it.id, name: it.name! };
      });
  },

  selectedInputDescriptor: (): MidiDeviceDescriptor | null => {
    if (selectedInput) {
      return { id: selectedInput.id, name: selectedInput.name! };
    }
    return null;
  },

  selectedOutputDescriptor: (): MidiDeviceDescriptor | null => {
    if (selectedOutput) {
      return { id: selectedOutput.id, name: selectedOutput.name! };
    }
    return null;
  },

  chosenInstrument: (): MidiInstrument => {
    return selectedInstrument;
  },

  init(callback: MidiCallback) {
    midiCallback = callback;

    if (!navigator.requestMIDIAccess) {
      // console.error("This browser does not support WebMIDI!")
      midiCallback?.setConnected(false);
      return;
    }

    const onMidiSuccess = async (midiAccess: MIDIAccess) => {
      availableInputs = midiAccess.inputs;
      availableOutputs = midiAccess.outputs;

      midiAccess.onstatechange = (e: any) => {
        if (e.port.type === "output" && selectedOutput && e.port.id === selectedOutput.id) {
          if (e.port.state === "connected") {
            midiCallback?.setConnected(true);
          } else {
            midiCallback?.setConnected(false);
          }
        }
      };

      const lastSelectedInputId = localStorage.getItem("selectedInput");
      if (lastSelectedInputId && availableInputs.get(lastSelectedInputId)) {
        await this.setSelectedInput(lastSelectedInputId);
      } else if (availableInputs.size > 0) {
        const midiInput = availableInputs.values().next().value as MIDIInput;
        await this.setSelectedInput(midiInput.id);
      }

      const lastSelectedOutputId = localStorage.getItem("selectedOutput");
      if (lastSelectedOutputId && availableOutputs.get(lastSelectedOutputId)) {
        await this.setSelectedOutput(lastSelectedOutputId);
      } else if (availableOutputs.size > 0) {
        const midiOutput = availableOutputs.values().next().value as MIDIOutput;
        await this.setSelectedOutput(midiOutput.id);
      }

      const lastMidiInstrument = localStorage.getItem("instrument");
      if (lastMidiInstrument) {
        this.setInstrument(AvailableMidiInstruments.find((it) => it.name === lastMidiInstrument)!);
      } else {
        this.setInstrument(AvailableMidiInstruments[0]);
      }
    };

    navigator.requestMIDIAccess({ sysex: true }).then((midiAccess: MIDIAccess) => onMidiSuccess(midiAccess), this.onMidiFailure);
  },

  // initInstruments: (instrument: Instrument) => {
  //   if (selectedOutput) {
  //     selectedOutput.send([192 | instrument.midiChannel, instrument.midiInstrument.code]);
  //   }
  // },

  release: (noteNumber: number, instrument: Instrument) => {
    if (selectedOutput) {
      selectedOutput.send([128 | instrument.index, noteNumber, 0]);
    }
  },

  play: (noteNumber: number, velocity: number, instrument: Instrument) => {
    if (selectedOutput) {
      // selectedOutput.send([192 | instrument.midiChannel, instrument.code]);
      selectedOutput.send([128 | instrument.index, noteNumber, 0]);
      selectedOutput.send([144 | instrument.index, noteNumber, velocity]);
    }
  },

  sustain: (on: boolean) => {
    if (selectedOutput) {
      selectedOutput?.send([176, 64, on ? 127 : 0]);
    }
  },

  resetDevice: () => {
    if (selectedOutput) {
      // selectedOutput.send([0xb0, 120, 0]);
      // selectedOutput.send([0xb0, 121, 0]);
      selectedOutput.send([0xb0, 123, 0]);
      selectedOutput.send([0xb1, 123, 0]);
      selectedOutput.send([0xb2, 123, 0]);
      selectedOutput.send([0xb3, 123, 0]);
      // selectedOutput.send([0xb0, 255, 0]);
      // selectedOutput.send([0b10110000, 121, 0])
      // selectedOutput.send([0b10110000, 122, 0])
      // selectedOutput.send([0b10110000, 123, 0])
      // selectedOutput.send([0b10110000, 124, 0])
    }
  },

  setSelectedInput: async (newInputId: string | null) => {
    if (selectedInput) {
      await selectedInput.close();
    }
    if (newInputId) {
      const newSelectedInput = availableInputs.get(newInputId);
      if (newSelectedInput) {
        selectedInput = newSelectedInput;
        await selectedInput.open();
        selectedInput.onmidimessage = (message: MIDIMessageEvent) => getMIDIMessage(message);
      }
    } else {
      selectedInput = null;
    }
    localStorage.setItem("selectedInput", selectedInput?.id ?? "");
  },

  setSelectedOutput: async (newOutputId: string | null) => {
    if (selectedOutput) {
      await selectedOutput.close();
    }
    if (newOutputId) {
      const newSelectedOutput = availableOutputs.get(newOutputId);
      if (newSelectedOutput) {
        selectedOutput = newSelectedOutput;
        await selectedOutput.open();
      }
    } else {
      selectedOutput = null;
    }
    localStorage.setItem("selectedOutput", selectedOutput?.id ?? "");
  },

  setInstrument: (instrument: MidiInstrument) => {
    selectedInstrument = instrument;
    selectedOutput?.send([192, instrument.code]);
    localStorage.setItem("instrument", instrument.name);
  },

  onMidiFailure: () => {
    // console.error("There was an error connecting to MIDI!")
    midiCallback?.setConnected(false);
  },
};

const getMIDIMessage = async (message: MIDIMessageEvent) => {
  const command = message.data[0];
  const key = message.data[1];
  const velocity = message.data.length > 2 ? message.data[2] : 0;

  if (command === 144) {
    if (velocity > 0) {
      await midiCallback?.keyOn(key, velocity);
    } else {
      await midiCallback?.keyOff(key);
    }
  } else if (command === 128) {
    await midiCallback?.keyOff(key);
  } else {
    // console.log(command)
  }
};
