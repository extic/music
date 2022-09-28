<template>
  <div class="song-box" :class="{ 'edit-mode': editMode }" @click="selectSong(song)">
    <div class="song-box-details">
      <div class="song-title">{{ song.name }}</div>
      <div class="song-author">{{ song.author }}</div>
      <div class="favorite" :class="{ selected: isFavorite(song) }" title="Mark as favorite" @click.stop="markFavorite(song)"></div>
      <div v-if="editMode" class="edit-mode-button delete" title="Delete" @click.stop="deleteSong(song)"></div>
      <div v-if="editMode" class="edit-mode-button open-folder" title="Open song folder" @click.stop="openSongFolder(song)"></div>
      <div v-if="editMode" class="edit-mode-button edit" title="Edit" @click.stop="editSong(song)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Song } from "../services/song-serializer.service";
import { defineComponent, PropType, computed } from "vue";
import { useSongStore } from "../store/song-store";
import { useSettingsStore } from "../store/settings-store";
import fs from "fs";
import { exec } from "child_process";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "SongBox",

  props: {
    song: {
      type: Object as PropType<Song>,
      required: true,
    },
  },

  setup() {
    const songs = useSongStore();
    const settings = useSettingsStore();
    const router = useRouter();

    const editMode = computed(() => {
      return settings.editMode;
    })

    const selectSong = (song: Song) => {
      if (!editMode.value) {
        songs.setSelectedSong(song);
        router.push({ name: "Song", params: { songId: song.id } });
      }
    };

    const isFavorite = (song: Song): boolean => {
      return song.favorite;
    };

    const markFavorite = (song: Song) => {
      songs.setFavorite(song.id, !song.favorite);
    };

    const deleteSong = (song: Song) => {
      fs.rmdirSync(song.folder, { recursive: true });
      songs.loadSongs();
    };

    const openSongFolder = (song: Song) => {
      exec(`start "" "${song.folder}"`);
    };

    const editSong = (song: Song) => {
      songs.setEditSongPaneShown(true, song);
    };

    return { editMode, selectSong, isFavorite, markFavorite, deleteSong, openSongFolder, editSong };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.song-box {
  border: 1px solid gray;
  border-radius: 1em;
  box-shadow: 0 0 10px -2px black, inset 0 0 10px 2px #69ccef;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  overflow: hidden;
  width: 22em;
  height: 15em;
  position: relative;

  &:hover {
    background-color: #69ccef;
    transform: scale(1.03);

    &.edit-mode {
      background-color: #f8b4b4;
    }
  }

  &.edit-mode {
    box-shadow: 0 0 10px -2px black, inset 0 0 10px 2px #ef6969;
  }

  .song-box-details {
    margin: 1em;
  }

  .favorite {
    position: absolute;
    top: 0.8em;
    left: 0.8em;
    width: 1.5em;
    height: 1.5em;
    transition: all 0.2s ease-in-out;
    display: block;

    &.selected {
      background-image: url("../assets/images/star.svg");
      background-size: cover;
    }
  }

  .edit-mode-button {
    position: absolute;
    bottom: 0.8em;
    width: 1.5em;
    height: 1.5em;
    transition: all 0.2s ease-in-out;
    display: block;

    &:hover {
      width: 2em;
      height: 2em;
      transform: rotateZ(10deg);
    }

    &.delete {
      left: 0.8em;
      background-image: url("../assets/images/recycle_bin.svg");
      background-size: cover;
    }

    &.open-folder {
      left: 3.8em;
      background-image: url("../assets/images/folder-outline.svg");
      background-size: cover;
    }

    &.edit {
      left: 6.8em;
      background-image: url("../assets/images/pencil-outline.svg");
      background-size: cover;
    }
  }

  &:hover {
    .favorite {
      position: absolute;
      top: 0.8em;
      left: 0.8em;
      width: 1.5em;
      height: 1.5em;
      transition: all 0.2s ease-in-out;
      background-image: url("../assets/images/star-empty.svg");
      background-size: cover;

      &:hover {
        transform: rotateZ(72deg);
        width: 2em;
        height: 2em;
      }

      &.selected {
        background-image: url("../assets/images/star.svg");
        background-size: cover;
      }
    }
  }

  .song-title {
    font-size: 1.8em;
    margin: 2em 0 0.5em 0;
    font-weight: bold;
    text-shadow: 0 0 1em #87d8ff;
  }

  .song-author {
    font-size: 1.3em;
  }
}
</style>
