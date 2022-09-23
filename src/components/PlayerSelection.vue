<template>
  <div class="player-selection">
    <button :class="{ selected: player === 'computer' }" class="player-button" @click="player = 'computer'">
      <img alt="left hand" src="../assets/images/computer-monitor.svg" />
      <span>Computer</span>
    </button>
    <div class="switch" @click="togglePlayer()">
      <button class="switch-button" :class="{ selected: player === 'human' }"></button>
    </div>
    <button :class="{ selected: player === 'human' }" class="player-button" @click="player = 'human'">
      <img alt="left hand" src="../assets/images/human.svg" />
      <span>Me!</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { usePlayerStore, PlayerType } from "../store/player-store";

export default defineComponent({
  name: "PlayerSelection",

  setup() {
    const playerStore = usePlayerStore();

    const player = computed({
      get(): PlayerType {
        return playerStore.player;
      },
      set(newValue: PlayerType): void {
        playerStore.setPlayer(newValue);
      },
    });

    const togglePlayer = () => {
      player.value = player.value === "human" ? "computer" : "human";
    };

    return { player, togglePlayer };
  },
});
</script>

<style lang="scss" scoped>
.player-selection {
  display: flex;
  align-items: center;
  gap: 2em;
  justify-content: center;

  .player-button {
    border: none;
    background-color: transparent;
    filter: opacity(0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
    flex-shrink: 0;
    padding: 1em;
    width: 5em;
    border-radius: 1em;
    border: 1px solid transparent;
    transition: background-color 0.1s;
    cursor: pointer;
    font-size: 1em;

    img {
      width: 3em;
    }

    &.selected {
      background: #69ccef;
      border: 1px solid #6d9fb1;
      filter: opacity(0.5);
    }

    &:hover {
      background: #b0d8e7;
    }
  }

  .switch {
    width: 3em;
    min-width: 3em;
    max-width: 3em;
    height: 1em;
    border: 1px solid lightgray;
    border-radius: 10px;
    background-color: rgb(223, 223, 223);
    position: relative;
    flex-shrink: 0;

    .switch-button {
      width: 2em;
      height: 2em;
      border: 1px solid #679bad;
      background-color: #69ccef;
      border-radius: 50%;
      position: absolute;
      top: -0.55em;
      left: -0.8em;
      transition: left 0.1s ease-in-out, right 0.1s ease-in-out;
      box-shadow: 0 0 4px 2px lightgray;
      cursor: pointer;
      font-size: 1em;

      &.selected {
        left: 1.8em;
      }
    }
  }
}
</style>
