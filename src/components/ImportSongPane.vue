<template>
  <div class="import-song-pane" :class="{ shown: songs.importSongPaneShown }">
    <div class="import-song-header">
      <h1>Import Song</h1>
      <button class="close" title="Close" @click="close">🠆</button>
    </div>
    <div v-if="importProgress === 100">
      <div class="field">
        <label for="fileName">File to import</label>
        <div class="one-liner">
          <input
            id="data-files-path"
            v-model="fileName"
            placeholder="MuseScore files *.mscz or *.musicxml"
            readonly
            @click="selectFile"
          />
          <button class="folder-button" @click="selectFile"></button>
        </div>
      </div>
      <div class="field">
        <button class="import-button" @click="importFile">Import</button>
      </div>
    </div>
    <div v-else>
      <label>Import status:</label>
      {{ importStatus }}
      <div class="progress-bar">
        <div class="progress-bar-line" :style="{right: (100 - importProgress) + '%'}"></div>
        <div class="progress-bar-value">{{ importProgress}}%</div>
      </div>
    </div>
    <!-- <div class="field">
      <label for="songAuthor">Composer / Arranger</label>
      <input id="songAuthor" v-model="songAuthor" placeholder="Song composer or author" />
    </div> -->
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent, ref } from "vue";
import { useSongStore } from "../store/song-store";
import { useSettingsStore } from "../store/settings-store";
import { isEmpty } from "lodash";

export default defineComponent({
  name: "EditSongPane",

  setup: function () {
    const songs = useSongStore();
    const settings = useSettingsStore();

    const importStatus = ref("");
    const importProgress = ref(100);
    const fileName = ref("");

    ipcRenderer.on("import-progress", (event, msg: { progress: number, status: string }) => {
      importStatus.value = msg.status;
      importProgress.value = msg.progress;

      if (msg.progress === 100) {
        songs.loadSongs();
        songs.setImportSongPaneShown(false);
      }
    });

    const selectFile = () => {
      const file = ipcRenderer.sendSync("choose-file-dialog", fileName.value);
      if (file) {
        fileName.value = file;
        importFile();
      }
    };

    const importFile = () => {
      if (!isEmpty(fileName.value.trim())) {
        ipcRenderer.send("import-file", fileName.value, settings.dataFilesPath);
      }
    }

    const close = () => {
      songs.setImportSongPaneShown(false);
    };

    return {
      songs,
      fileName,
      selectFile,
      importFile,
      close,
      importStatus,
      importProgress,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.import-song-pane {
  display: block;
  position: fixed;
  top: -25em;
  left: 2em;
  right: 2em;
  bottom: 0;
  height: 22em;
  background-color: rgb(249, 250, 255);
  z-index: 10;
  box-shadow: 0px 0px 20px 0px black;
  transition: top 0.2s;
  text-align: left;
  padding: 2em;
  box-sizing: border-box;

  &.shown {
    top: 0;
  }

  .import-song-header {
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

    .one-liner {
      display: flex;
      flex-direction: row;
      gap: 1em;
    }

    label {
      margin-bottom: 0.5em;
    }

    input {
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

    .import-button {
      @include pressable;
      align-self: center;
      border-radius: 50%;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      padding: 0.5em 3em;
      cursor: pointer;

      &:hover {
        background-color: #80c4dd;
        color: white;
      }
    }
  }

  .progress-bar {
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 0.2em;
    position: relative;
    overflow: hidden;
    height: 1.8em;

    .progress-bar-line {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      background-color: #80c4dd;
    }

    .progress-bar-value {
      position: absolute;
      left: calc(50% - 3em);
    }
  }
}
</style>
