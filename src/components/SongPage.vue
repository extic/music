<template>
  <div class="song-page">
    <div class="score-container">
      <div v-if="showLoading" class="loading">
        <img src="../assets/images/loading.gif" />
      </div>
      <div class="score-inner-container">
        <img v-for="(page, index) in pageImages" :key="`page-${index}`" :src="page" width="100%"/>
        <!-- <div
          v-for="group in groups"
          :key="group.id"
          class="group"
          :style="{ left: `${group.left}px`, width: `${group.width}px`, top: `${group.top}px`, height: `${group.height}px` }"
          @click="groupClicked(group)"
        > -->
          <!-- <div class="hover-trap"></div>
        </div> -->
        <!-- <div
          v-show="currGroup"
          ref="marker"
          class="marker"
          :style="{ left: `${currGroup.left}px`, width: `${currGroup.width}px`, top: `${currGroup.top}px`, height: `${currGroup.height}px` }"
        >
          <div class="marker-highlight"></div>
        </div> -->
      </div>
      <!-- <ContextMenu ref="noteGroupContextMenu" @contextMenuClosed="contextMenuClosed()">
          <ContextMenuItem :enabled="selectedGroup !== -1" :text="setLoopStartText()" @select="setLoopStart()"></ContextMenuItem>
          <ContextMenuItem :enabled="selectedGroup !== -1" :text="setLoopEndText()" @select="setLoopEnd()"></ContextMenuItem>
          <ContextMenuItemSeparator />
          <ContextMenuItem text="Clear loop" @select="clearLoop()"></ContextMenuItem>
        </ContextMenu>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { getSongPages } from "../services/song-serializer.service";
// import { IOSMDOptions, OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref } from "vue";
import { usePlayerStore } from "../store/player-store";
import { useSongStore } from "../store/song-store";
// import { SongParser, VerticalGroup } from "../utils/SongParser";
// import { SongPlayer } from "../utils/SongPlayer";

export default defineComponent({
  name: "SongPage",

  // components: { ContextMenu, ContextMenuItem, ContextMenuItemSeparator },

  setup() {
    const songs = useSongStore();
    const player = usePlayerStore();

    const song = computed(() => songs.selectedSong);
    const pageImages = ref([] as string[]);

    // const groups = computed(() => {
    //   return player.groups;
    // });

    // const currGroup = computed(() => {
    //   return player.groups[player.position] ?? <VerticalGroup>{ left: 0, top: 0, width: 0, height: 0 };
    // });

    const showLoading = ref(true);
    // const osmdDiv = ref("osmdContainer");
    const marker = ref<HTMLDivElement>();

    const scrollMarkerIntoView = () => {
      marker.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    // const groupClicked = (group: VerticalGroup) => {
    //   player.setPosition(group.id);
    // };

    onMounted(() => {
      pageImages.value = getSongPages(song.value!!);
      console.log(pageImages);
      showLoading.value = false;

      // const parseSong = (osmd: OSMD) => {
      //   const songData = SongParser.parse(osmd);
      //   // console.log(songData);
      //   // this.groups = songData.verticalGroups;

      //   const playerStore = usePlayerStore();
      //   playerStore.setInstruments(songData.instruments);
      //   playerStore.setSelectedInstrument(songData.instruments[0]);
      //   playerStore.setGroups(songData.verticalGroups);
      //   playerStore.setBpm(songData.bpm);
      //   SongPlayer.initInstruments();

      //   SongParser.printDebug(songData);
      // };

      // ipcRenderer.send("get-music-xml", songs.selectedSong?.file);
      // ipcRenderer.once("music-xml-loaded", async (_event, ...args) => {
      //   class A extends OSMD {
      //     protected handleResize(startCallback: () => void, endCallback: () => void): void {
      //       super.handleResize(
      //         () => {
      //           startCallback();
      //         },
      //         () => {
      //           endCallback();
      //           parseSong(this);
      //           showLoading.value = false;
      //           nextTick(() => {
      //             marker.value?.addEventListener("transitionend", scrollMarkerIntoView);
      //           });
      //         }
      //       );
      //     }
      //   }

      //   const options: IOSMDOptions = {
      //     backend: "svg",
      //     drawTitle: true,
      //   };
      //   const osmd = new A(osmdDiv.value, options);

      //   // // // osmd.EngravingRules.RenderSingleHorizontalStaffline = true;
      //   await osmd.load(args[0]);
      // });
    });

    onUnmounted(() => {
      marker.value?.removeEventListener("transitionend", scrollMarkerIntoView);
    });

    return { showLoading, song, pageImages, marker };
    // return { showLoading, groups, currGroup, osmdDiv, marker, groupClicked };
  },

  // mounted() {
  //   const songs = useSongStore();
  //   const osmdDiv = this.$refs.osmdContainer as HTMLDivElement;

  // methods: {
  //   async loadPageImages() {
  //     const pageNumbers = Array.from(Array(this.songData.pageCount).keys());
  //     const responses = await Promise.all(
  //       pageNumbers.map((pageNumber) => {
  //         return axios.get(`/api/score/${this.songData.songId}/page/${pageNumber + 1}`, { responseType: "arraybuffer" });
  //       })
  //     );

  //     this.pageImages = responses
  //       .map((it) => it.data)
  //       .map((it) => {
  //         return btoa(new Uint8Array(it).reduce((data, byte) => data + String.fromCharCode(byte), ""));
  //       })
  //       .map((it) => `data:image/jpg;base64,${it}`);

  //     this.resizeObserver = new ResizeObserver(async () => {
  //       await this.calcGroupPositions();
  //     });
  //     const container = this.$refs.container as HTMLDivElement;
  //     this.resizeObserver.observe(container);
  //   },

  //   async scoreLoaded() {
  //     this.showLoading = false;

  //     this.marker = this.$refs.marker as HTMLDivElement;
  //     this.marker.addEventListener("transitionend", this.scrollMarkerIntoView);

  //     // this.ctx.fillStyle = "#00FF00AA"
  //     // this.songData.noteGroups.forEach(noteGroup => {
  //     //   const height1 = noteGroup.maxPosY - noteGroup.minPosY
  //     //   this.ctx.fillRect(
  //     //     (noteGroup.minPosX * this.songData.scaling * width / (this.songData.pageWidth * this.songData.scaling)),
  //     //     (noteGroup.minPosY * this.songData.scaling * height / (this.songData.pageHeight * this.songData.pageCount * this.songData.scaling)), 10,
  //     //
  //     //     (height1 * this.songData.scaling * height / (this.songData.pageHeight * this.songData.pageCount * this.songData.scaling)))
  //     // })

  //     this.calcGroupPositions();
  //     const playerState = player(this.$store);
  //     this.paintCanvas(playerState.position);
  //     this.positionHandler = this.$store.watch(
  //       () => playerState.position,
  //       (position) => {
  //         this.paintCanvas(position);
  //       }
  //     );

  //     await this.$store.dispatch("resetPlay", 0);
  //   },

  //   calcGroupPositions() {
  //     const container = this.$refs.container as HTMLDivElement;
  //     const computedStyle = getComputedStyle(container);

  //     const width = parseInt(computedStyle.getPropertyValue("width"), 10);
  //     const height = parseInt(computedStyle.getPropertyValue("height"), 10);

  //     const canvas = document.getElementById("score") as HTMLCanvasElement;
  //     canvas.width = width;
  //     canvas.height = height;

  //     this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  //     this.markerWidth = width / 50;
  //     this.groupPositions = this.songData.noteGroups.map((noteGroup, index) => {
  //       const posX = (noteGroup.minPosX * this.songData.scaling * width) / (this.songData.pageWidth * this.songData.scaling) - this.markerWidth / 3;
  //       const posY = (noteGroup.minPosY * this.songData.scaling * height) / (this.songData.pageHeight * this.songData.pageCount * this.songData.scaling) - 30;
  //       const groupHeight = ((noteGroup.maxPosY - noteGroup.minPosY) * this.songData.scaling * height) / (this.songData.pageHeight * this.songData.pageCount * this.songData.scaling) + 60;
  //       return { index, posX, posY, width: width / 50, height: groupHeight };
  //     });

  //     this.paintCanvas(player(this.$store).position);
  //   },

  //   scrollMarkerIntoView() {
  //     this.marker?.scrollIntoView({ behavior: "smooth", block: "center" });
  //   },

  //   paintCanvas(position: number) {
  //     if (position >= 0) {
  //       const groupPosition = this.groupPositions[position];
  //       this.markerPosX = groupPosition.posX;
  //       this.markerPosY = groupPosition.posY - 50;
  //       this.markerHeight = groupPosition.height + 100;
  //     }
  //   },

  //   setLoopStartText() {
  //     return (this.selectedGroup === this.startBlock ? "Clear" : "Set as") + " loop start";
  //   },

  //   setLoopEndText() {
  //     return (this.selectedGroup === this.endBlock ? "Clear" : "Set as") + " loop end";
  //   },

  //   setLoopStart() {
  //     if (this.startBlock === -1) {
  //       this.startBlock = this.selectedGroup;
  //     } else {
  //       this.startBlock = this.startBlock === this.selectedGroup ? -1 : this.selectedGroup;
  //     }
  //     if (this.startBlock !== -1 && this.startBlock === this.endBlock) {
  //       this.endBlock = -1;
  //     }
  //   },

  //   setLoopEnd() {
  //     if (this.endBlock === -1) {
  //       this.endBlock = this.selectedGroup;
  //     } else {
  //       this.endBlock = this.endBlock === this.selectedGroup ? -1 : this.selectedGroup;
  //     }
  //     if (this.endBlock !== -1 && this.startBlock === this.endBlock) {
  //       this.startBlock = -1;
  //     }
  //   },

  //   clearLoop() {
  //     this.startBlock = -1;
  //     this.endBlock = -1;
  //   },

  //   contextMenuClosed() {
  //     this.selectedGroup = -1;
  //   },

  //   openNoteGroupContextMenu(event: MouseEvent, index: number) {
  //     this.selectedGroup = index;
  //     const contextMenu = this.$refs.noteGroupContextMenu as unknown as typeof ContextMenu;
  //     contextMenu.show(event);
  //   },

  //   setCurrentPosition(index: number) {
  //     this.$store.commit("setPosition", index);
  //   },
  // },

  // computed: {
  //   startBlock: {
  //     get(): number {
  //       return player(this.$store).startBlock;
  //     },
  //     set(newValue: number) {
  //       this.$store.commit("setStartBlock", newValue);
  //     },
  //   },

  //   endBlock: {
  //     get(): number {
  //       return player(this.$store).endBlock;
  //     },
  //     set(newValue: number) {
  //       this.$store.commit("setEndBlock", newValue);
  //     },
  //   },

  //   pageNumbers(): number[] {
  //     return Array.from(Array(this.songData.pageCount).keys());
  //   },
  // },
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
      // background-color: #ff000045;
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

  // .group {
  //   position: absolute;
  //   background-color: #ff000045;

  //   &:hover {
  //     background-color: rgba(132, 151, 255, 0.5);
  //     border: 1px solid red;
  //   }
  // }
}
</style>
