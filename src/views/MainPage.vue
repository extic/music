<template>
  <div class="main-page">
    <HeaderBar style="z-index: 20" />
    <router-view />
    <div class="background"></div>
    <!-- <SettingsPane /> -->
    <!-- <EditSongPane /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderBar from "../components/HeaderBar.vue";
// import SettingsPane from "../components/SettingsPane.vue";
// import EditSongPane from "../components/EditSongPane.vue";

export default defineComponent({
  name: "MainPage",
  components: { HeaderBar },//, SettingsPane, EditSongPane },
});
</script>

<style lang="scss" scoped>
.main-page {
  width: 100%;
  height: 100%;

  .background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("../assets/images/background.jpg") no-repeat 50% 50%;
    background-size: cover;
    z-index: -1;
  }
}

button {
  margin-top: 5em;
}
</style>
