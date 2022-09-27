<template>
  <div class="song-box" :class="{ locked: false /*song.locked*/ }" @click="playSong(song)">
    <div class="song-box-details">
      <div class="song-title">{{ song.name }}</div>
      <div class="song-author">{{ song.author }}</div>
      <div class="favorite" :class="{ selected: isFavorite(song) }" title="Mark as favorite" @click.stop="markFavorite(song)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Song } from "../services/song-serializer.service";
import { defineComponent, PropType } from "vue";
import { useRouter } from "vue-router";
import { useSongStore } from "../store/song-store";

export default defineComponent({
  name: "SongBox",

  props: {
    song: {
      type: Object as PropType<Song>,
      required: true,
    },
  },

  setup() {
    const router = useRouter();
    const songs = useSongStore();

    const playSong = (song: Song) => {
      songs.setSelectedSong(song);
      // router.push({ name: "Song", params: { songId: song.uuid } });
    };

    const isFavorite = (song: Song): boolean => {
      return song.favorite;
    };

    const markFavorite = (song: Song) => {
      songs.setFavorite(song.id, !song.favorite);
    };

    return { playSong, isFavorite, markFavorite };
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
