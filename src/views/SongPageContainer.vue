<template>
  <div class="song-page-container" :class="{ 'notes-only': !isKeyboardShown }">
    <PianoKeyboard class="keyboard" v-if="isKeyboardShown"></PianoKeyboard>
    <PlayControls class="controls"></PlayControls>
    <SongPage class="note-sheet" />
    <!-- <div class="keyboard" v-if="isKeyboardShown" /> -->
    <!-- <div class="controls" /> -->
    <!-- <div class="note-sheet" id="osmdContainer" /> -->
  </div>
</template>

<script lang="ts">
// import { layout } from "@/store/layout-module";
import { computed, defineComponent, ref } from "vue";
import PianoKeyboard from "../components/PianoKeyboard.vue";
import SongPage from "../components/SongPage.vue";
import PlayControls from "../components/PlayControls.vue";
import { useLayoutStore } from "../store/layout-store";

export default defineComponent({
  name: "SongPageContainer",
  components: {
    PianoKeyboard,
    SongPage,
    PlayControls,
  },

  setup() {
    const layout = useLayoutStore();

    const isKeyboardShown = computed(() => {
      return layout.keyboardShown;
    });

    layout.setKeyboardButtonShown(true);

    return { isKeyboardShown };
  },

  // mounted() {
  //   const osmdDiv = ref("osmdContainer");
  //   // var osmd = new osmdModule.OpenSheetMusicDisplay("osmdContainer");
  //   const options: IOSMDOptions = {
  //     backend: "svg",
  //     drawTitle: true,
  //     // drawingParameters: "compacttight" // don't display title, composer etc., smaller margins
  //   };
  //   const osmd = new OSMD(osmdDiv.value, options);
  //   axios.get("/api/score").then((content) => {
  //     // midiService.init()
  //     osmd.load(content.data).then(function () {
  //       osmd.render();
  //       osmd.enableOrDisableCursors(true);
  //       const cursor = osmd.cursor;
  //       cursor.reset();
  //       cursor.show();
  //       // osmd.cursor.cursorElement.src = "";
  //       // osmd.cursor.cursorElement.setAttribute("style", "backgroundColor: 'red'");
  //       const iterator = cursor.iterator;
  //       let lastTimestamp = 0;
  //       let currentTimestamp = iterator.currentTimeStamp.RealValue;
  //       let delay = (currentTimestamp - lastTimestamp) * 100;
  //       console.log(delay);
  //       const loop = () => {
  //         setTimeout(() => {
  //           osmd.cursor.next();
  //           // console.log(cursor);
  //           iterator.CurrentVoiceEntries.forEach((voiceEntries) => {
  //             voiceEntries.Notes.forEach((note) => {
  //               // console.log(note.halfTone);
  //               midiService.play(note.halfTone, 0x40);
  //             });
  //           });
  //           // console.log(iterator.currentTimeStamp);
  //           // osmd.cursor.NotesUnderCursor currentVoiceEntries[0].
  //           lastTimestamp = currentTimestamp;
  //           currentTimestamp = iterator.currentTimeStamp.RealValue;
  //           delay = (currentTimestamp - lastTimestamp) * 10000;
  //           console.log(lastTimestamp, currentTimestamp, delay);
  //           loop();
  //         }, delay);
  //       };
  //       loop();
  //     });
  //   });
  // },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables";

$container-padding: 1em;

.song-page-container {
  width: calc(100% - #{2 * $container-padding});
  padding: $container-padding;
  height: calc(100% - #{$header-height} - #{2 * $container-padding});
  box-sizing: content-box;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: minmax(15em, 20vw) auto;
  grid-template-rows: min-content 1fr;
  grid-template-areas:
    "controls keyboard"
    "controls note-sheet";

  &.notes-only {
    grid-template-rows: 1fr;
    grid-template-areas: "controls note-sheet";
  }

  .keyboard {
    grid-area: keyboard;
  }

  .controls {
    grid-area: controls;
    z-index: 1;
    overflow: auto;
  }

  .note-sheet {
    grid-area: note-sheet;
    overflow-y: overlay;
    min-width: 45em;
    margin-top: 0.5em;
  }
}
</style>
