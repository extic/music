<template>
    <div class="welcome-page">
      <img src="../assets/images/welcome-image-1.jpg" class="back-image" />
      <img src="../assets/images/welcome-image-2.jpg" class="back-image delay1" />
      <img src="../assets/images/welcome-image-3.jpg" class="back-image delay2" />
      <div class="welcome-container">
        <div class="title">
          Welcome to the Extremely Music Learning Experience
        </div>
        <button @click="enter()">Please, Enter</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import { useRouter } from "vue-router";
  
  export default defineComponent({
    name: "WelcomePage",
  
    setup() {
      const router = useRouter();
  
      const enter = () => {
        router.push("song-list");
      };
  
      return { enter };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .welcome-page {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  
    .back-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation-name: example;
      animation-duration: 12s;
      animation-iteration-count: infinite;
  
      &.delay1 {
        animation-delay: 4s;
      }
      &.delay2 {
        animation-delay: 8s;
      }
    }
  
    @keyframes example {
      0% {
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      35% {
        opacity: 1;
      }
      40% {
        opacity: 0;
      }
      100% {
        opacity: 0;
      }
    }
  
    .welcome-container {
      margin: 2em;
      position: absolute;
      padding: 5em;
      background-color: #ffffffcc;
      border-radius: 1em;
      border: 1px solid white;
  
      .title {
        font-size: 2em;
      }
  
      button {
        margin-top: 3em;
        border: 1px solid #87d8ff;
        border-radius: 5px;
        padding: 0.7em 2em;
        background-color: #69ccef;
        color: white;
        font-size: 1.2em;
        cursor: pointer;
      }
    }
  }
  </style>
  