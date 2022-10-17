<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MidiCallback, midiService } from './services/midi-service';
import { useMidiStore } from './store/midi-store';
import { usePlayerStore } from './store/player-store';
import { useSongStore } from './store/song-store';
import { SongPlayer } from './utils/SongPlayer';

export default defineComponent({
  name: "App",

  setup() {
    // const settings = useSettingsStore();
    const midi = useMidiStore();
    const songs = useSongStore();
    const player = usePlayerStore();

    class MidiCallBackImpl implements MidiCallback {
      setConnected(connected: boolean): void {
        midi.setConnected(connected);
      }

      keyOn(key: number, velocity: number) {
        // // midi.setUserVelocity(velocity);
        // // midi.keyOn(key, velocity);

        player.setPressedKey(key);
        if (player.playingTimeoutId) {
          clearTimeout(player.playingTimeoutId);
        }
        SongPlayer.triggerKeys();
      }

      keyOff(key: number) {
        player.removePressedKey(key);
        // // midi.keyOff(key);
        // SongPlayer.triggerKeys();
      }
    }

    midiService.init(new MidiCallBackImpl());
    songs.loadSongs();
  },
});
</script>

<style lang="scss">
html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  @media (max-width: 1200px) {
    font-size: 11px;
  }

  @media (max-width: 780px) {
    font-size: 8px;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-button {
  width: 0;
  height: 0;
}

::-webkit-scrollbar-thumb {
  background: #69ccef;
  border: 0 double #ffffff;
  border-radius: 46px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5da2bc;
}

::-webkit-scrollbar-thumb:active {
  background: #527988;
}

::-webkit-scrollbar-track {
  background: #ffffff;
  border: 0 double #ffffff;
  border-radius: 3px;
}

::-webkit-scrollbar-track:hover {
  background: #f9f9f9;
}

::-webkit-scrollbar-track:active {
  background: #f9f9f9;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

* {
  box-sizing: border-box;
}

/* >>> #cursorImg-1 {
    transition: all 0.2s ease-in-out;
  } */

/* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .logo-box {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .logo-box span {
    width: 74px;
  }

  .static-public {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .static-public code {
    background-color: #eee;
    padding: 2px 4px;
    margin: 0 4px;
    border-radius: 4px;
    color: #304455;
  } */
</style>
