<template>
  <div class="edit-song-pane" :class="{ shown: songs.editSongPaneShown }">
    <div class="edit-song-header">
      <h1>Edit Song Details</h1>
      <button class="close" title="Close" @click="close">🠆</button>
    </div>
    <div class="field">
      <label for="songName">Song Name</label>
      <input id="song-name" v-model="songName" placeholder="The song name" />
    </div>
    <div class="field">
      <label for="songAuthor">Composer / Arranger</label>
      <input id="songAuthor" v-model="songAuthor" placeholder="Song composer or author" />
    </div>
  </div>
</template>

<script lang="ts">
import { saveSongJson } from "../services/song-serializer.service";
import { defineComponent, ref, watch } from "vue";
import { useSongStore } from "../store/song-store";
import { isEmpty } from "lodash";

export default defineComponent({
  name: "EditSongPane",

  setup: function () {
    const songs = useSongStore();

    const songName = ref("");
    const songAuthor = ref("");

    watch(
        () => songs.editSongPaneShown,
        (newValue, _) => {
          if (newValue) {
            songName.value = songs.selectedSong!!.name;
            songAuthor.value = songs.selectedSong!!.author;
          }
        }
      );

    const close = () => {
      if (!isEmpty(songName.value.trim()) && !isEmpty(songAuthor.value.trim())) {
        songs.selectedSong!!.name = songName.value;
        songs.selectedSong!!.author = songAuthor.value;
        saveSongJson(songs.selectedSong!!);
        // songs.loadSongs();
      }
      songs.setEditSongPaneShown(false);
    };

    return {
      songs,
      songName,
      songAuthor,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.edit-song-pane {
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

  .edit-song-header {
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
    }

    input {
      padding: 0.5em;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      flex-grow: 1;
    }
  }
}
</style>
