<template>
  <div class="song-page">
    <div class="score-container">
      <div v-if="showLoading" class="loading">
        <img src="../assets/images/loading.gif" />
      </div>
      <div ref="container" class="score-inner-container">
        <img v-for="(page, index) in pageImages" :key="`page-${index}`" :src="page" width="100%" :onload="pageLoaded"/>
        <div
          v-for="measure in measurePositions"
          :key="measure.id"
          class="measure"
          :style="{ left: `${measure.posX}px`, width: `${measure.width}px`, top: `${measure.posY}px`, height: `${measure.height}px` }"
          >
        </div>
        <div
          v-for="group in groupPositions"
          :key="group.id"
          class="group"
          :style="{ left: `${group.posX}px`, width: `${group.width}px`, top: `${group.posY}px`, height: `${group.height}px` }"
          @click="groupClicked(group)"
          @click.right.stop.prevent="openNoteGroupContextMenu($event, group.id)"
          >
          <div class="hover-trap" :class="{'start-block': group.id === startBlock, 'end-block': group.id === endBlock}"></div>
        </div>
        <div
          v-show="currGroup"
          ref="marker"
          class="marker"
          :style="{ left: `${currGroup.posX}px`, width: `${currGroup.width}px`, top: `${currGroup.posY}px`, height: `${currGroup.height}px` }"
        >
          <div class="marker-highlight"></div>
        </div>
      </div>
      <ContextMenu ref="noteGroupContextMenu" @contextMenuClosed="contextMenuClosed()">
        <ContextMenuItem :enabled="!!selectedGroup" :text="setLoopStartText()" @select="setLoopStart()"></ContextMenuItem>
        <ContextMenuItem :enabled="!!selectedGroup" :text="setLoopEndText()" @select="setLoopEnd()"></ContextMenuItem>
        <ContextMenuItemSeparator />
        <ContextMenuItem text="Clear loop" @select="clearLoop()"></ContextMenuItem>
      </ContextMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { getSongPages } from "../services/song-serializer.service";
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { usePlayerStore } from "../store/player-store";
import { useSongStore } from "../store/song-store";
import { parseSong, printDebug } from "../utils/parser/song.parser";
import ContextMenuItemSeparator from "./menu/ContextMenuItemSeparator.vue"
import ContextMenuItem from "./menu/ContextMenuItem.vue"
import ContextMenu from "./menu/ContextMenu.vue"

type ElementPosition = {
  id: number;
  posX: number;
  posY: number;
  width: number;
  height: number;
}

export default defineComponent({
  name: "SongPage",

  components: { ContextMenu, ContextMenuItem, ContextMenuItemSeparator },

  setup() {
    const songs = useSongStore();
    const player = usePlayerStore();

    const song = computed(() => songs.selectedSong);
    const pageImages = ref([] as string[]);

    const showLoading = ref(true);
    const container = ref<HTMLDivElement>();
    const marker = ref<HTMLDivElement>();
    const noteGroupContextMenu = ref<HTMLDivElement>();
    const measurePositions = ref([] as ElementPosition[]);
    const groupPositions = ref([] as ElementPosition[]);
    const resizeObserver = ref(null as ResizeObserver | null);
    const selectedGroup = ref(undefined as number | undefined);

    const startBlock = computed({
      get(): number | undefined {
        return player.startBlock;
      },
      set(newValue: number | undefined ) {
        player.setStartBlock(newValue);
      },
    });

    const endBlock = computed({
      get(): number | undefined {
        return player.endBlock;
      },
      set(newValue: number | undefined) {
        player.setEndBlock(newValue);
      },
    });

    const currGroup = computed(() => {
      return groupPositions.value[player.position] ?? { posX: 0, posY: 0, width: 0, height: 0 };
    });

    const scrollMarkerIntoView = () => {
      marker.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const calcElementPositions = () => {
      const computedStyle = getComputedStyle(container.value!!)
      const width = parseInt(computedStyle.getPropertyValue("width"), 10)
      const height = parseInt(computedStyle.getPropertyValue("height"), 10)

      const pageData = player.pageData;

      measurePositions.value = player.measures.map((measure) => {
        const posX = measure.pos.x * width / (pageData.pageWidth)
        const posY = measure.pos.y * height / (pageData.pageHeight * pageData.pageCount);
        const measureWidth = measure.dimension.width * width / pageData.pageWidth;
        const measureHeight = measure.dimension.height * height / (pageData.pageHeight * pageData.pageCount);
        return {id: measure.number, posX, posY, width: measureWidth, height: measureHeight};
      });

      groupPositions.value = player.groups.map((group) => {
        const posX = group.pos.x * width / pageData.pageWidth - group.dimension.width / 3;
        const posY = group.pos.y * height / (pageData.pageHeight * pageData.pageCount);
        const groupWidth = group.dimension.width * width / pageData.pageWidth;
        const groupHeight = group.dimension.height * height / (pageData.pageHeight * pageData.pageCount);
        return {id: group.id, posX, posY, width: groupWidth, height: groupHeight};
      });

      // this.paintCanvas(player(this.$store).position)
    };

    let loadedPages = 0;
    const pageLoaded = () => {
      loadedPages++;
      if (loadedPages === pageImages.value.length) {
        calcElementPositions()

        resizeObserver.value = new ResizeObserver(async () => {
          calcElementPositions()
        })
        resizeObserver.value.observe(container.value!!);

        marker.value!!.addEventListener("transitionend", scrollMarkerIntoView);
      }
    };

    const groupClicked = (group: ElementPosition) => {
      player.setPosition(group.id);
    };

    const setLoopStartText = () => {
      return (selectedGroup.value === startBlock.value ? "Clear" : "Set as") + " loop start";
    };

    const setLoopEndText = () => {
      return (selectedGroup.value === endBlock.value ? "Clear" : "Set as") + " loop end";
    };

    const setLoopStart = () => {
      if (startBlock.value === -1) {
        startBlock.value = selectedGroup.value;
      } else {
        startBlock.value = startBlock.value === selectedGroup.value ? -1 : selectedGroup.value;
      }
      if (startBlock.value !== -1 && startBlock.value === endBlock.value) {
        endBlock.value = -1;
      }
    };

    const setLoopEnd = () => {
      if (endBlock.value === -1) {
        endBlock.value = selectedGroup.value;
      } else {
        endBlock.value = endBlock.value === selectedGroup.value ? -1 : selectedGroup.value;
      }
      if (endBlock.value !== -1 && startBlock.value === endBlock.value) {
        startBlock.value = -1;
      }
    };

    const clearLoop = () => {
      startBlock.value = -1;
      endBlock.value = -1;
    };

    const contextMenuClosed = () => {
      selectedGroup.value = undefined;
    };

    const openNoteGroupContextMenu = (event: MouseEvent, index: number) => {
      selectedGroup.value = index;
      // const contextMenu = this.$refs.noteGroupContextMenu as unknown as typeof ContextMenu
      (noteGroupContextMenu.value as unknown as typeof ContextMenu).show(event)
    };

    onMounted(() => {
      const songData = parseSong(song.value!!)
      printDebug(songData);

      pageImages.value = getSongPages(song.value!!);
      showLoading.value = false;

      const playerStore = usePlayerStore();
      playerStore.setInstruments(songData.instruments);
      playerStore.setSelectedInstrument(songData.instruments[0]);
      playerStore.setMeasures(songData.measures);
      playerStore.setGroups(songData.groups);
      playerStore.setPageData(songData.pageData);
      //   playerStore.setBpm(songData.bpm);
      //   SongPlayer.initInstruments();

      //   SongParser.printDebug(songData);
      // };
    });

    onUnmounted(() => {
      if (resizeObserver.value) {
          resizeObserver.value.disconnect()
      }

      marker.value?.removeEventListener("transitionend", scrollMarkerIntoView);
    });

    return {
      showLoading,
      song,
      pageImages,
      container,
      marker,
      pageLoaded,
      groupPositions,
      measurePositions,
      currGroup,
      groupClicked,
      selectedGroup,
      startBlock,
      endBlock,
      setLoopStartText,
      setLoopEndText,
      setLoopStart,
      setLoopEnd,
      clearLoop,
      contextMenuClosed,
      openNoteGroupContextMenu,
      noteGroupContextMenu,
     };
  },
});
</script>

<style lang="scss" scoped>
.song-page {
  background-color: white;
  border: 1px solid gray;
  padding: 2em;
  box-shadow: 4px 5px 5px grey;
  z-index: 1;

  .score-container {
    height: 100%;

    .loading {
      height: 100%;

      img {
        margin: 20vh;
        width: 15em;
      }
    }

    .score-inner-container {
      position: relative;

      img {
        width: 100%;
      }

      canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .measure {
    position: absolute;
    background-color: #6f22ff;
    opacity: 0;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.1;
    }

  }

  .group {
    position: absolute;

    .hover-trap {
      background-color: transparent;
      position: absolute;
      position: absolute;
      top: -20px;
      bottom: -20px;
      left: 0;
      right: 0;
      border-radius: 3px;

      &.selected,
      &:hover {
        background-color: #ff000055;
        box-shadow: 0 0 3px 3px #ff000045;

        &.unselected {
          background-color: transparent;
        }
      }

      &.start-block {
        border-width: 0.3em 0 0.3em 0.6em;
        border-color: #ff6464;
        border-radius: 50% 0 0 50%;
        border-style: double;
      }

      &.end-block {
        border-width: 0.3em 0.6em 0.3em 0;
        border-color: #ff6464;
        border-radius: 0 50% 50% 0;
        border-style: double;
      }
    }
  }

  .marker {
    position: absolute;
    background-color: transparent;
    transition: top 0.1s ease-in-out, left 0.1s ease-in-out;

    .marker-highlight {
      position: absolute;
      top: -20px;
      bottom: -20px;
      left: 0;
      right: 0;
      background-color: #5bcdff77;
      box-shadow: 0 0 3px 3px #5bcdff77;
      border-radius: 3px;
    }
  }
}
</style>
