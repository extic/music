<template>
  <hr/>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "ContextMenuItemSeparator"
})
</script>

<style scoped lang="scss">

hr {
  margin: 0.3em 0.5em;
  border: 0;
  border-bottom: 1px solid lightgray;
}

</style>
