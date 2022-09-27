<template>
  <div class="play-controls">
    <div class="group">
      <div class="group-label">Who is playing?</div>
      <PlayerSelection />
    </div>
    <div v-if="player === 'computer'" class="group-container">
      <div class="group">
        <div class="group-label">Play Controls</div>
        <div class="play-buttons">
          <button @click="play" :disabled="playing">
            <img src="../assets/images/play.svg" />
            <div>Play</div>
          </button>
          <button @click="stop" :disabled="!playing">
            <img src="../assets/images/pause.svg" />
            <div>Pause</div>
          </button>
          <button @click="reset">
            <img src="../assets/images/stop.svg" />
            <div>Stop</div>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="group-container">
      <div class="group">
        <div class="group-label">Choose Instrument</div>
        <select v-model="selectedInstrument">
          <option v-for="instrument in instruments" :value="instrument">
            {{ instrument.name }}
          </option>
        </select>
      </div>
      <div class="group">
        <div class="group-label">Practice</div>
        <div v-if="(selectedInstrument?.staffCount ?? 1) > 1">
          <div class="practice-buttons">
            <button :class="{ selected: practiceLeftHand }" class="hand-button left-hand" @click="practiceLeftHand = !practiceLeftHand">
              <img alt="left hand" src="../assets/images/hand-left.svg" />
              <span>Left Hand</span>
            </button>
            <button :class="{ selected: practiceRightHand }" class="hand-button right-hand" @click="practiceRightHand = !practiceRightHand">
              <img alt="right hand" src="../assets/images/hand-right.svg" />
              <span>Right Hand</span>
            </button>
          </div>
        </div>
        <div @click="autoAccompany = !autoAccompany" class="checkbox">
          <input :checked="autoAccompany" type="checkbox" />
          <label>Accompany with other hand / instruments</label>
        </div>
      </div>
      <!-- <button @click="play" :disabled="playing">PLAY</button>
      <button @click="stop" :disabled="!playing">STOP</button>
      <button @click="reset">RESET</button> -->
    </div>
    <!--
    <div class="group">
      <div class="group-label">Controls</div>
      <button class="button" @click="play()">Start</button>
      <button class="button" @click="stop()">Stop</button>
      <button class="button" @click="reset()">Reset</button>
    </div>

    <div class="group">
      <div class="group-label">Correct Tone Volume</div>
      <div @click="togglePlayHighPitchWhenCorrect()">
        <input :checked="isPlayHighPitchWhenCorrect" type="checkbox" />
        <label>Play High Pitch Note When Correct</label>
      </div>
      <div>
        <div>Volume:</div>
        <input v-model="correctNoteVolume" max="127" min="0" type="range" />
      </div>
    </div>

    <div class="group">
      <div class="group-label">Other-Hand Volume</div>
      <div @click="toggleUseUserVelocityForAccompanying()">
        <input :checked="useUserVelocityForAccompanying" type="checkbox" />
        <label>Use user key press velocities</label>
      </div>
      <div>
        <div>Volume:</div>
        <input v-model="accompanyVelocity" max="127" min="0" type="range" />
      </div>
    </div>
  -->
    <div class="group">
      <div class="group-label">Play Speed</div>
      <div>
        <div class="play-speed-labels">
          <span @click="setPlaySpeed(2)">x0.5</span>
          <span @click="setPlaySpeed(1)">x1</span>
          <span @click="setPlaySpeed(0.5)">x2</span>
        </div>
        <input class="play-speed-input" v-model="playSpeed" max="100" min="0" type="range" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Instrument } from "../utils/parser/song.data";
import { defineComponent, computed } from "vue";
import PlayerSelection from "../components/PlayerSelection.vue";
// import { midiService } from "../services/midi-service";
import { usePlayerStore, PlayerType } from "../store/player-store";
import { SongPlayer } from "../utils/SongPlayer";
// import { midi } from "@/store/midi-module";
// import { midiService } from "@/services/midi-service";

export default defineComponent({
  name: "PlayControls",

  components: { PlayerSelection },

  setup() {
    const playerStore = usePlayerStore();

    const playing = computed(() => {
      return playerStore.playing;
    });

    const player = computed(() => {
      return playerStore.player;
    });

    const instruments = computed(() => {
      return playerStore.instruments;
    });

    const selectedInstrument = computed({
      get(): Instrument | null {
        return playerStore.selectedInstrument;
      },
      set(newValue: Instrument | null): void {
        playerStore.setSelectedInstrument(newValue);
      },
    });

    const practiceLeftHand = computed({
      get(): boolean {
        return playerStore.practiceLeftHand;
      },
      set(newValue: boolean): void {
        if (newValue || playerStore.practiceRightHand) {
          playerStore.setPracticeLeftHand(newValue);
        }
      },
    });

    const practiceRightHand = computed({
      get(): boolean {
        return playerStore.practiceRightHand;
      },
      set(newValue: boolean): void {
        if (newValue || playerStore.practiceLeftHand) {
          playerStore.setPracticeRightHand(newValue);
        }
      },
    });

    const autoAccompany = computed({
      get(): boolean {
        return playerStore.autoAccompany;
      },
      set(newValue: boolean): void {
        playerStore.setAutoAccompany(newValue);
      },
    });

    const playSpeed = computed({
      get(): number {
        return -((-0.025 + Math.sqrt(0.025 * 0.025 - 4 * 0.0001 * (2 - playerStore.playSpeed))) / (2 * 0.0001));
      },

      set(speed: number) {
        playerStore.setPlaySpeed(0.0001 * speed * speed + -0.025 * speed + 2);
      },
    });

    const setPlaySpeed = (playSpeed: number) => {
      playerStore.setPlaySpeed(playSpeed);
    };

    const play = SongPlayer.play;
    const stop = SongPlayer.stop;
    const reset = SongPlayer.reset;

    return { playing, player, instruments, selectedInstrument, practiceLeftHand, practiceRightHand, autoAccompany, play, stop, reset, playSpeed, setPlaySpeed };
  },

  // methods: {
  //   play() {
  //     // this.$store.commit("setAutoPlay", true);
  //     // this.$store.dispatch("triggerKeys", []);
  //   },

  //   stop() {
  //     // this.$store.commit("setAutoPlay", false);
  //     // midiService.resetDevice();
  //   },

  //   reset() {
  //     // let startBlock = player(this.$store).startBlock;
  //     // if (startBlock !== -1) {
  //     //   this.$store.dispatch("resetPlay", startBlock);
  //     // } else {
  //     //   this.$store.dispatch("resetPlay", 0);
  //     // }
  //   },
  // toggleAccompanyWithOtherHand() {
  //   if (this.isPracticeRightHand && this.isPracticeLeftHand) {
  //     return;
  //   }
  //   // this.$store.commit("setAccompanyWithOtherHand", !player(this.$store).accompanyWithOtherHand);
  // },

  //   togglePlayHighPitchWhenCorrect() {
  //     // this.$store.commit("setPlayHighPitchWhenCorrect", !player(this.$store).playHighPitchWhenCorrect);
  //   },

  //   toggleUseUserVelocityForAccompanying() {
  //     // this.$store.commit("setUseUserVelocityForAccompanying", !midi(this.$store).useUserVelocityForAccompanying);
  //   },
  // },

  // computed: {
  //   isAccompanyWithOtherHand(): boolean {
  //     // return player(this.$store).accompanyWithOtherHand;
  //     return false;
  //   },

  //   isPracticeRightHand(): boolean {
  //     // return player(this.$store).practiceRightHand;
  //     return false;
  //   },

  //   isPracticeLeftHand(): boolean {
  //     // return player(this.$store).practiceLeftHand;
  //     return false;
  //   },

  //   isPlayHighPitchWhenCorrect(): boolean {
  //     // return player(this.$store).playHighPitchWhenCorrect;
  //     return false;
  //   },

  //   correctNoteVolume: {
  //     get(): number {
  //       // return midi(this.$store).correctToneVelocity;
  //       return 0;
  //     },

  //     set(velocity: number) {
  //       // this.$store.commit("setCorrectToneVelocity", velocity);
  //     },
  //   },

  //   useUserVelocityForAccompanying: {
  //     get(): boolean {
  //       //return midi(this.$store).useUserVelocityForAccompanying;
  //       return false;
  //     },
  //     set(newValue: boolean) {
  //       // this.$store.commit("setUseUserVelocityForAccompanying", newValue);
  //     },
  //   },

  //   accompanyVelocity: {
  //     get(): number {
  //       // return midi(this.$store).accompanyVelocity;
  //       return 0;
  //     },

  //     set(velocity: number) {
  //       // this.$store.commit("setAccompanyVelocity", velocity);
  //     },
  //   },

  //   playSpeed: {
  //     get(): number {
  //       // return -((-0.025 + Math.sqrt(0.025 * 0.025 - 4 * 0.0001 * (2 - player(this.$store).playSpeed))) / (2 * 0.0001));
  //       return 0;
  //     },

  //     set(speed: number) {
  //       // this.$store.commit("setPlaySpeed", 0.0001 * speed * speed + -0.025 * speed + 2);
  //     },
  //   },
  // },
});
</script>

<style lang="scss" scoped>
.play-controls {
  text-align: left;
  display: flex;
  flex-direction: column;
  row-gap: 2em;
  padding-top: 0.5em;
  padding-right: 0.5em;

  .group-container {
    z-index: -20;
    display: flex;
    flex-direction: column;
    row-gap: 2em;
  }

  .group {
    border: 1px solid lightgray;
    border-radius: 0.3em;
    padding: 1em;
    background-color: white;
    position: relative;
    z-index: -2;
    display: flex;
    flex-direction: column;
    row-gap: 1em;

    .group-label {
      position: absolute;
      top: -0.7em;
      left: 0.5em;
      font-size: 0.9em;
      font-weight: bold;
      padding: 0 0.5em;

      &:before {
        content: "";
        width: 100%;
        height: 3px;
        display: block;
        position: absolute;
        margin-top: calc(0.7em - 1px);
        background-color: white;
        margin-left: -0.5em;
        z-index: -1;
      }
    }

    hr {
      width: 80%;
      margin: 0;
      height: 0;
      align-self: center;
      border: 0;
      border-top: 1px solid lightgray;
    }

    select {
      padding: 0.3em 1em;
      border-radius: 4px;
      border: 1px solid lightgray;
    }
  }

  .play-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;

    button {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      align-items: center;
      border: none;
      background: none;
      cursor: pointer;

      &:disabled {
        cursor: default;
        img {
          filter: opacity(0.1);

          &:hover {
            filter: opacity(0.1);
          }
        }
      }

      img:hover {
        filter: opacity(1);
        background: #b0d8e7;
      }

      img {
        width: 3em;
        height: 3em;
        filter: opacity(0.5);
        transition: filter 0.2s;
        border-radius: 50%;
      }
    }
  }

  .practice-buttons {
    text-align: center;
    display: flex;
    column-gap: 1em;
    justify-content: center;

    .hand-button {
      border: 1px solid gray;
      border-radius: 0.5em;
      width: 7em;
      height: 7em;
      background-color: #d4d4d4;
      color: white;
      transition: background-color 0.2s;
      cursor: pointer;
      outline: none;
      box-shadow: 3px 3px 3px #c6c6c6;

      &.selected {
        box-shadow: inset 0 0 5px 3px #58a0ba;
        background-color: #69ccef;

        img {
          margin-top: 0;
          margin-left: -0.2em;
        }
      }

      img {
        margin-top: 0.2em;
        width: 4em;
        height: 4em;
      }

      span {
        display: block;
      }

      &:hover {
        border-style: solid;
        border-width: 3px;
        border-color: #58a0ba #6fbad2 #6fbad2 #58a0ba;
      }
    }
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;

    input {
      cursor: pointer;
    }

    label {
      font-size: 0.9em;
      cursor: pointer;
    }
  }

  // input[type="range"] {
  //   width: 100%;
  // }

  .play-speed-labels {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }

  .play-speed-input {
    width: 100%;
  }

  // .disabled {
  //   text-decoration: line-through;
  //   color: lightgray;
  // }
}
</style>
