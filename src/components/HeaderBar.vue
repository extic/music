<template>
  <div class="header-bar">
    <div v-if="song" class="back-button" @click="backPressed">Back</div>
    <div class="main-header">
      <div v-if="!song" class="page-title">Song List</div>
      <div v-else class="selected-song">
        <div class="page-title">{{ song.name }}</div>
        <div v-if="song.author" class="song-author">{{ song.author }}</div>
      </div>
    </div>
    <div class="controls">
      <button v-if="song" class="edit-button" @click="showEditSongPane">Edit</button>
      <div class="midi">
        <img v-if="isMidiConnected" alt="midi on" src="../assets/images/midi-connected.svg" title="MIDI device connected successfully" />
        <img v-else alt="midi off" class="disconnected" src="../assets/images/midi-disconnected.svg" title="MIDI device is not connected" />
      </div>
      <div class="separator"></div>
      <div class="button fullscreen">
        <img
          v-if="isInFullscreen"
          alt="fullscreen on"
          src="../assets/images/fullscreen-close.svg"
          title="Step out of full screen"
          @click="toggleFullScreen()"
        />
        <img v-else alt="fullscreen off" src="../assets/images/fullscreen-open.svg" title="Open in full screen" @click="toggleFullScreen()" />
      </div>
      <div v-if="isShowKeyboardButton" class="button keyboard">
        <img
          v-if="isShowKeyboard"
          alt="keyboard on"
          src="../assets/images/keyboard-show.svg"
          title="Hide virtual keyboard"
          @click="setKeyboardShown(false)"
        />
        <img v-else alt="keyboard off" src="../assets/images/keyboard-hide.svg" title="Show virtual keyboard" @click="setKeyboardShown(true)" />
      </div>
      <div class="button settings" @click="showSettings">
        <img src="../assets/images/settings.svg" title="Settings" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useLayoutStore } from "../store/layout-store";
import { useMidiStore } from "../store/midi-store";
import { useSettingsStore } from "../store/settings-store";
import { useSongStore } from "../store/song-store";
// import { SongPlayer } from "../utils/SongPlayer";

export default defineComponent({
  name: "HeaderBar",

  setup: function () {
    const router = useRouter();
    const midi = useMidiStore();
    const settings = useSettingsStore();
    const layout = useLayoutStore();
    const songs = useSongStore();

    const isInFullscreen = ref(false);

    const song = computed(() => songs.selectedSong);
    const isShowKeyboardButton = computed(() => layout.keyboardButtonShown);
    const isShowKeyboard = computed(() => layout.keyboardShown);
    const isMidiConnected = computed(() => midi.connected);

    const backPressed = () => {
//       // store.dispatch("resetPlay");
      songs.setSelectedSong(null);
      layout.setKeyboardButtonShown(false);
//       SongPlayer.reset();
      router.push({ name: "SongList" });
    };

    const toggleFullScreen = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        isInFullscreen.value = false;
      } else {
        document.documentElement.requestFullscreen();
        isInFullscreen.value = true;
      }
    };

    const setKeyboardShown = (show: boolean) => {
      layout.setKeyboardShown(show);
    };

    const showSettings = async () => {
      settings.setShown(!settings.shown);
    };

    const showEditSongPane = (e: Event) => {
      songs.setEditSongPaneShown(true);
    };

    return {
      isInFullscreen,
      song,
      isShowKeyboardButton,
      isShowKeyboard,
      isMidiConnected,
      backPressed,
      toggleFullScreen,
      setKeyboardShown,
      showSettings,
      showEditSongPane,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.header-bar {
  display: flex;
  align-items: center;
  background-color: #69ccef;
  color: white;
  height: $header-height;
  padding: 0 1em;
  box-sizing: border-box;
  border-bottom: 1px solid gray;

  &:hover > .controls > .edit-button {
    opacity: 1;
  }

  .back-button {
    margin-right: 3em;
    padding: 0.3em 2em;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s;
    border-radius: 4px;

    &:before {
      content: "<";
      position: absolute;
      left: 1em;
    }

    &:hover {
      background-color: gray;
    }
  }

  .main-header {
    flex-grow: 1;
    display: flex;
    align-items: center;

    .page-title {
      font-size: 2em;
      margin-right: 1em;
    }

    .selected-song {
      display: flex;
      align-items: baseline;
    }
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1em;

    .edit-button {
      opacity: 0;
      transition: opacity 0.2s, background-color 0.2s, border 0.2s, color 0.2s;
      cursor: pointer;
      background-color: #00000033;
      border: 1px solid #00000055;
      border-radius: 4px;
      padding: 0.2em 1em;
      color: #dfdfdf;
      margin-right: 1em;

      &:hover {
        background-color: #00000022;
        border: 1px solid #00000033;
        color: #ffffff;
      }
    }

    .button {
      width: 1.5em;
      height: 1.5em;
      padding: 0.5em;
      box-sizing: content-box;
      cursor: pointer;

      &:hover {
        background-color: #95e3ff;
        border-radius: 50%;
      }

      img {
        width: 1.5em;
        height: 1.5em;
      }
    }

    .midi {
      img {
        width: 2em;
        height: 2em;

        &.disconnected {
          animation: flashing 0.5s steps(1, end) infinite;
        }
      }
    }

    .separator {
      margin: 0 0.5em;
      width: 1px;
      border-right: 1px solid white;
      height: 2em;
    }
  }

  @keyframes flashing {
    0% {
      visibility: visible;
    }
    50% {
      visibility: hidden;
    }
  }
}
</style>
