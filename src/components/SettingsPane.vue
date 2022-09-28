<template>
  <div class="settings-pane" :class="{ shown: settings.shown }">
    <div class="settings-header">
      <h1>Settings</h1>
      <button class="close" title="Close settings" @click="close">🠆</button>
    </div>

    <div class="field one-liner">
      <label for="edit-mode">Toggle song edit mode</label>
      <button id="edit-mode" @click="toggleEditMode">{{ editMode ? "Exit" : "Enter" }} Edit Mode</button>
    </div>

    <div class="field">
      <label for="data-files-path">Data Files Path</label>
      <div class="one-liner">
        <input
          id="data-files-path"
          v-model="dataFilesPath"
          placeholder="The folder that contains the musicxml files"
          readonly
          @click="selectDataFilesPath"
        />
        <button class="folder-button" @click="selectDataFilesPath"></button>
      </div>
    </div>

    <div class="field">
      <label for="midi-input-device">MIDI Input Device</label>
      <select id="midi-input-device" v-model="midiInputDevice" :disabled="availableMidiInputs().length === 0">
        <option v-for="input in availableMidiInputs()" :key="input.id" :value="input">
          {{ input.name }}
        </option>
      </select>
    </div>

    <div class="field">
      <label for="midi-output-device">MIDI Output Device</label>
      <select id="midi-output-device" v-model="midiOutputDevice" :disabled="availableMidiOutputs().length === 0">
        <option v-for="output in availableMidiOutputs()" :key="output.id" :value="output">
          {{ output.name }}
        </option>
      </select>
    </div>
    <div class="field">
      <label for="midi-instrument">Instrument</label>
      <select id="midi-instrument" v-model="midiInstrument">
        <option v-for="instrument in availableMidiInstruments()" :key="instrument.code" :value="instrument">
          {{ instrument.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { useLayoutStore } from "../store/layout-store";
import { SongPlayer } from "../utils/SongPlayer";
import { defineComponent, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { AvailableMidiInstruments, MidiDeviceDescriptor, MidiInstrument, midiService } from "../services/midi-service";
import { useSettingsStore } from "../store/settings-store";
import { useSongStore } from "../store/song-store";

export default defineComponent({
  name: "SettingsPane",

  setup: function () {
    const settings = useSettingsStore();
    const songs = useSongStore();
    const layout = useLayoutStore();
    const router = useRouter();

    const editMode = computed(() => settings.editMode);
    const dataFilesPath = computed(() => settings.dataFilesPath);
    // const midiInputDevice = ref(midiService.selectedInputDescriptor());
    // const midiOutputDevice = ref(midiService.selectedOutputDescriptor());
    const midiInstrument = ref(midiService.chosenInstrument());

    const toggleEditMode = () => {
      settings.setEditMode(!settings.editMode);
      settings.setShown(false);
      songs.setSelectedSong(null);
      layout.setKeyboardButtonShown(false);
      SongPlayer.reset();
      router.push({ name: "SongList" });
    };

    const midiInputDevice = computed({
      get(): MidiDeviceDescriptor | null {
        return midiService.selectedInputDescriptor();
      },
      set(newValue: MidiDeviceDescriptor | null) {
        midiService.setSelectedInput(newValue?.id ?? null);
      },
    });

    const midiOutputDevice = computed({
      get(): MidiDeviceDescriptor | null {
        return midiService.selectedOutputDescriptor();
      },
      set(newValue: MidiDeviceDescriptor | null) {
        console.log(newValue);
        midiService.setSelectedOutput(newValue?.id ?? null);
      },
    });

    // watch(midiInstrument, (currentValue) => {
    //   settings.setMidiInstrument(currentValue);
    // });

    const availableMidiInputs = (): MidiDeviceDescriptor[] => {
      return midiService.availableMidiInputNames();
    };

    const availableMidiOutputs = (): MidiDeviceDescriptor[] => {
      return midiService.availableMidiOutputNames();
    };

    const availableMidiInstruments = (): MidiInstrument[] => {
      return AvailableMidiInstruments;
    };

    const close = () => {
      settings.setShown(false);
    };

    const selectDataFilesPath = () => {
      const path = ipcRenderer.sendSync("open-folder-dialog", dataFilesPath.value);
      if (path) {
        console.log(path);
        settings.setDataFilesPath(path);
        songs.loadSongs();
      }
    };

    return {
      settings,
      editMode,
      toggleEditMode,
      dataFilesPath,
      availableMidiInputs,
      availableMidiOutputs,
      availableMidiInstruments,
      midiInputDevice,
      midiOutputDevice,
      midiInstrument,
      close,
      selectDataFilesPath,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.settings-pane {
  display: block;
  position: fixed;
  top: $header-height;
  right: -35em;
  bottom: 0;
  background-color: rgb(249, 250, 255);
  width: 30em;
  // height: 30px;
  z-index: 10;
  box-shadow: -15px 0 20px -15px black;
  transition: right 0.2s;
  text-align: left;
  padding: 2em;
  box-sizing: border-box;

  &.shown {
    right: 0;
  }

  .settings-header {
    display: flex;
    margin-bottom: 2em;

    h1 {
      margin: 0;
      flex-grow: 1;
    }

    .close {
      @include pressable;
      flex-shrink: 0;
      border: none;
      background: none;
      font-size: 2em;
      width: 1.4em;
      height: 1.4em;
      line-height: 1.4em;
      border-radius: 50%;
      transition: color 0.2s, background-color 0.2s;
      cursor: pointer;

      &:hover {
        background-color: #80c4dd;
        color: white;
      }
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    margin-bottom: 2em;

    label {
      margin-bottom: 0.5em;
      line-height: 1.4em;
    }

    input,
    select {
      padding: 0.5em;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      flex-grow: 1;
    }

    .folder-button {
      @include pressable;
      flex-shrink: 0;
      width: 3em;
      background: url(../assets/images/folder.svg) no-repeat 50% 50%;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      cursor: pointer;
    }

    button {
      @include pressable;
      flex-shrink: 0;
      padding: 0.3em 2em;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .one-liner {
      display: flex;
      flex-direction: row;
      gap: 1em;

      label {
        margin-bottom: 0;
      }
    }
}
</style>
