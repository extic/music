<template>
  <div class="piano-keyboard">
    <div class="keyboard-container">
      <img class="keyboard-image" src="../assets/images/full_layout_piano_keyboard.svg" width="100%" />
      <div class="key key-21" v-if="keyShouldBePressed(21)"></div>
      <div class="key key-22" v-if="keyShouldBePressed(22)"></div>
      <div class="key key-23" v-if="keyShouldBePressed(23)"></div>
      <div class="key key-24" v-if="keyShouldBePressed(24)"></div>
      <div class="key key-25" v-if="keyShouldBePressed(25)"></div>
      <div class="key key-26" v-if="keyShouldBePressed(26)"></div>
      <div class="key key-27" v-if="keyShouldBePressed(27)"></div>
      <div class="key key-28" v-if="keyShouldBePressed(28)"></div>
      <div class="key key-29" v-if="keyShouldBePressed(29)"></div>
      <div class="key key-30" v-if="keyShouldBePressed(30)"></div>
      <div class="key key-31" v-if="keyShouldBePressed(31)"></div>
      <div class="key key-32" v-if="keyShouldBePressed(32)"></div>
      <div class="key key-33" v-if="keyShouldBePressed(33)"></div>
      <div class="key key-34" v-if="keyShouldBePressed(34)"></div>
      <div class="key key-35" v-if="keyShouldBePressed(35)"></div>
      <div class="key key-36" v-if="keyShouldBePressed(36)"></div>
      <div class="key key-37" v-if="keyShouldBePressed(37)"></div>
      <div class="key key-38" v-if="keyShouldBePressed(38)"></div>
      <div class="key key-39" v-if="keyShouldBePressed(39)"></div>
      <div class="key key-40" v-if="keyShouldBePressed(40)"></div>
      <div class="key key-41" v-if="keyShouldBePressed(41)"></div>
      <div class="key key-42" v-if="keyShouldBePressed(42)"></div>
      <div class="key key-43" v-if="keyShouldBePressed(43)"></div>
      <div class="key key-44" v-if="keyShouldBePressed(44)"></div>
      <div class="key key-45" v-if="keyShouldBePressed(45)"></div>
      <div class="key key-46" v-if="keyShouldBePressed(46)"></div>
      <div class="key key-47" v-if="keyShouldBePressed(47)"></div>
      <div class="key key-48" v-if="keyShouldBePressed(48)"></div>
      <div class="key key-49" v-if="keyShouldBePressed(49)"></div>
      <div class="key key-50" v-if="keyShouldBePressed(50)"></div>
      <div class="key key-51" v-if="keyShouldBePressed(51)"></div>
      <div class="key key-52" v-if="keyShouldBePressed(52)"></div>
      <div class="key key-53" v-if="keyShouldBePressed(53)"></div>
      <div class="key key-54" v-if="keyShouldBePressed(54)"></div>
      <div class="key key-55" v-if="keyShouldBePressed(55)"></div>
      <div class="key key-56" v-if="keyShouldBePressed(56)"></div>
      <div class="key key-57" v-if="keyShouldBePressed(57)"></div>
      <div class="key key-58" v-if="keyShouldBePressed(58)"></div>
      <div class="key key-59" v-if="keyShouldBePressed(59)"></div>
      <div class="key key-60" v-if="keyShouldBePressed(60)"></div>
      <div class="key key-61" v-if="keyShouldBePressed(61)"></div>
      <div class="key key-62" v-if="keyShouldBePressed(62)"></div>
      <div class="key key-63" v-if="keyShouldBePressed(63)"></div>
      <div class="key key-64" v-if="keyShouldBePressed(64)"></div>
      <div class="key key-65" v-if="keyShouldBePressed(65)"></div>
      <div class="key key-66" v-if="keyShouldBePressed(66)"></div>
      <div class="key key-67" v-if="keyShouldBePressed(67)"></div>
      <div class="key key-68" v-if="keyShouldBePressed(68)"></div>
      <div class="key key-69" v-if="keyShouldBePressed(69)"></div>
      <div class="key key-70" v-if="keyShouldBePressed(70)"></div>
      <div class="key key-71" v-if="keyShouldBePressed(71)"></div>
      <div class="key key-72" v-if="keyShouldBePressed(72)"></div>
      <div class="key key-73" v-if="keyShouldBePressed(73)"></div>
      <div class="key key-74" v-if="keyShouldBePressed(74)"></div>
      <div class="key key-75" v-if="keyShouldBePressed(75)"></div>
      <div class="key key-76" v-if="keyShouldBePressed(76)"></div>
      <div class="key key-77" v-if="keyShouldBePressed(77)"></div>
      <div class="key key-78" v-if="keyShouldBePressed(78)"></div>
      <div class="key key-79" v-if="keyShouldBePressed(79)"></div>
      <div class="key key-80" v-if="keyShouldBePressed(80)"></div>
      <div class="key key-81" v-if="keyShouldBePressed(81)"></div>
      <div class="key key-82" v-if="keyShouldBePressed(82)"></div>
      <div class="key key-83" v-if="keyShouldBePressed(83)"></div>
      <div class="key key-84" v-if="keyShouldBePressed(84)"></div>
      <div class="key key-85" v-if="keyShouldBePressed(85)"></div>
      <div class="key key-86" v-if="keyShouldBePressed(86)"></div>
      <div class="key key-87" v-if="keyShouldBePressed(87)"></div>
      <div class="key key-88" v-if="keyShouldBePressed(88)"></div>
      <div class="key key-89" v-if="keyShouldBePressed(89)"></div>
      <div class="key key-90" v-if="keyShouldBePressed(90)"></div>
      <div class="key key-91" v-if="keyShouldBePressed(91)"></div>
      <div class="key key-92" v-if="keyShouldBePressed(92)"></div>
      <div class="key key-93" v-if="keyShouldBePressed(93)"></div>
      <div class="key key-94" v-if="keyShouldBePressed(94)"></div>
      <div class="key key-95" v-if="keyShouldBePressed(95)"></div>
      <div class="key key-96" v-if="keyShouldBePressed(96)"></div>
      <div class="key key-97" v-if="keyShouldBePressed(97)"></div>
      <div class="key key-98" v-if="keyShouldBePressed(98)"></div>
      <div class="key key-99" v-if="keyShouldBePressed(99)"></div>
      <div class="key key-100" v-if="keyShouldBePressed(100)"></div>
      <div class="key key-101" v-if="keyShouldBePressed(101)"></div>
      <div class="key key-102" v-if="keyShouldBePressed(102)"></div>
      <div class="key key-103" v-if="keyShouldBePressed(103)"></div>
      <div class="key key-104" v-if="keyShouldBePressed(104)"></div>
      <div class="key key-105" v-if="keyShouldBePressed(105)"></div>
      <div class="key key-106" v-if="keyShouldBePressed(106)"></div>
      <div class="key key-107" v-if="keyShouldBePressed(107)"></div>
      <div class="key key-108" v-if="keyShouldBePressed(108)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { usePlayerStore } from "../store/player-store";
import { defineComponent, computed } from "vue";
// import { PressedKeys, usePlayerStore } from "../store/player-store";

export default defineComponent({
  name: "PianoKeyboard",

  setup() {
    const player = usePlayerStore();
    // const keys = computed((): PressedKeys => {
    //   return player.pressedKeys;
    // });

    const keyShouldBePressed = (key: number): boolean => {
      return true;
      // return !!keys.value[+key];
    };

    // return { keys, keyShouldBePressed };
    return { keyShouldBePressed };
  },
});
</script>

<style lang="scss" scoped>
.piano-keyboard {
  width: 100%;

  .keyboard-container {
    position: relative;

    img {
      width: 100%;
      height: 100%;
      box-shadow: 0 0 10px -2px black;
    }

    @mixin key {
      position: absolute;
      top: 10px;
      border-radius: 5px;
    }

    @mixin white-key {
      @include key();
      bottom: 10%;
      width: 0.962%;
      background-color: #ff000099;
      box-shadow: 0 0 5px 3px #ff000099;
      z-index: 1000;
    }

    @mixin black-key {
      @include key();
      bottom: 40%;
      width: 0.962%;
      background-color: #8888ff;
      box-shadow: 0 0 5px 3px #8888ff;
      z-index: 1001;
    }

    .key-21 {
      @include white-key();
      left: 0.481%;
    }

    .key-22 {
      @include black-key();
      left: 1.717%;
    }

    .key-23 {
      @include white-key();
      left: 2.404%;
    }

    .key-24 {
      @include white-key();
      left: 4.327%;
    }

    .key-25 {
      @include black-key();
      left: 5.014%;
    }

    .key-26 {
      @include white-key();
      left: 6.25%;
    }

    .key-27 {
      @include black-key();
      left: 7.486%;
    }

    .key-28 {
      @include white-key();
      left: 8.173%;
    }

    .key-29 {
      @include white-key();
      left: 10.096%;
    }

    .key-30 {
      @include black-key();
      left: 10.783%;
    }

    .key-31 {
      @include white-key();
      left: 12.019%;
    }

    .key-32 {
      @include black-key();
      left: 12.981%;
    }

    .key-33 {
      @include white-key();
      left: 13.942%;
    }

    .key-34 {
      @include black-key();
      left: 15.179%;
    }

    .key-35 {
      @include white-key();
      left: 15.865%;
    }

    .key-36 {
      @include white-key();
      left: 17.788%;
    }

    .key-37 {
      @include black-key();
      left: 18.475%;
    }

    .key-38 {
      @include white-key();
      left: 19.712%;
    }

    .key-39 {
      @include black-key();
      left: 20.948%;
    }

    .key-40 {
      @include white-key();
      left: 21.635%;
    }

    .key-41 {
      @include white-key();
      left: 23.558%;
    }

    .key-42 {
      @include black-key();
      left: 24.245%;
    }

    .key-43 {
      @include white-key();
      left: 25.481%;
    }

    .key-44 {
      @include black-key();
      left: 26.442%;
    }

    .key-45 {
      @include white-key();
      left: 27.404%;
    }

    .key-46 {
      @include black-key();
      left: 28.64%;
    }

    .key-47 {
      @include white-key();
      left: 29.327%;
    }

    .key-48 {
      @include white-key();
      left: 31.25%;
    }

    .key-49 {
      @include black-key();
      left: 31.937%;
    }

    .key-50 {
      @include white-key();
      left: 33.173%;
    }

    .key-51 {
      @include black-key();
      left: 34.409%;
    }

    .key-52 {
      @include white-key();
      left: 35.096%;
    }

    .key-53 {
      @include white-key();
      left: 37.019%;
    }

    .key-54 {
      @include black-key();
      left: 37.706%;
    }

    .key-55 {
      @include white-key();
      left: 38.942%;
    }

    .key-56 {
      @include black-key();
      left: 39.904%;
    }

    .key-57 {
      @include white-key();
      left: 40.865%;
    }

    .key-58 {
      @include black-key();
      left: 42.102%;
    }

    .key-59 {
      @include white-key();
      left: 42.788%;
    }

    .key-60 {
      @include white-key();
      left: 44.712%;
    }

    .key-61 {
      @include black-key();
      left: 45.398%;
    }

    .key-62 {
      @include white-key();
      left: 46.635%;
    }

    .key-63 {
      @include black-key();
      left: 47.871%;
    }

    .key-64 {
      @include white-key();
      left: 48.558%;
    }

    .key-65 {
      @include white-key();
      left: 50.481%;
    }

    .key-66 {
      @include black-key();
      left: 51.168%;
    }

    .key-67 {
      @include white-key();
      left: 52.404%;
    }

    .key-68 {
      @include black-key();
      left: 53.365%;
    }

    .key-69 {
      @include white-key();
      left: 54.327%;
    }

    .key-70 {
      @include black-key();
      left: 55.563%;
    }

    .key-71 {
      @include white-key();
      left: 56.25%;
    }

    .key-72 {
      @include white-key();
      left: 58.173%;
    }

    .key-73 {
      @include black-key();
      left: 58.86%;
    }

    .key-74 {
      @include white-key();
      left: 60.096%;
    }

    .key-75 {
      @include black-key();
      left: 61.332%;
    }

    .key-76 {
      @include white-key();
      left: 62.019%;
    }

    .key-77 {
      @include white-key();
      left: 63.942%;
    }

    .key-78 {
      @include black-key();
      left: 64.629%;
    }

    .key-79 {
      @include white-key();
      left: 65.865%;
    }

    .key-80 {
      @include black-key();
      left: 66.827%;
    }

    .key-81 {
      @include white-key();
      left: 67.788%;
    }

    .key-82 {
      @include black-key();
      left: 69.025%;
    }

    .key-83 {
      @include white-key();
      left: 69.712%;
    }

    .key-84 {
      @include white-key();
      left: 71.635%;
    }

    .key-85 {
      @include black-key();
      left: 72.321%;
    }

    .key-86 {
      @include white-key();
      left: 73.558%;
    }

    .key-87 {
      @include black-key();
      left: 74.794%;
    }

    .key-88 {
      @include white-key();
      left: 75.481%;
    }

    .key-89 {
      @include white-key();
      left: 77.404%;
    }

    .key-90 {
      @include black-key();
      left: 78.091%;
    }

    .key-91 {
      @include white-key();
      left: 79.327%;
    }

    .key-92 {
      @include black-key();
      left: 80.288%;
    }

    .key-93 {
      @include white-key();
      left: 81.25%;
    }

    .key-94 {
      @include black-key();
      left: 82.486%;
    }

    .key-95 {
      @include white-key();
      left: 83.173%;
    }

    .key-96 {
      @include white-key();
      left: 85.096%;
    }

    .key-97 {
      @include black-key();
      left: 85.783%;
    }

    .key-98 {
      @include white-key();
      left: 87.019%;
    }

    .key-99 {
      @include black-key();
      left: 88.255%;
    }

    .key-100 {
      @include white-key();
      left: 88.942%;
    }

    .key-101 {
      @include white-key();
      left: 90.865%;
    }

    .key-102 {
      @include black-key();
      left: 91.552%;
    }

    .key-103 {
      @include white-key();
      left: 92.788%;
    }

    .key-104 {
      @include black-key();
      left: 93.75%;
    }

    .key-105 {
      @include white-key();
      left: 94.712%;
    }

    .key-106 {
      @include black-key();
      left: 95.948%;
    }

    .key-107 {
      @include white-key();
      left: 96.635%;
    }

    .key-108 {
      @include white-key();
      left: 98.558%;
    }
  }
}
</style>
