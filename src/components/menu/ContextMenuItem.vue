<template>
    <li :class="{'enabled': enabled}" class="context-menu-item" @click="select()">
        <div class="inner">{{ text }}</div>
    </li>
</template>

<script lang="ts">
import ContextMenu from "./menu/ContextMenu.vue"
import {defineComponent} from "vue";

export default defineComponent({
    name: "ContextMenuItem",
    props: {
        text: String,
        enabled: {
            type: Boolean,
            default: true
        }
    },

    methods: {
        select() {
            if (!this.enabled) {
                return
            }
            this.$emit("select")
            const parent = this.$parent as unknown as typeof ContextMenu
            parent.close()
        }
    }
})
</script>

<style lang="scss" scoped>
//@import "../styles/variables";
.context-menu-item {
    list-style: none;
    color: lightgray;
    white-space: nowrap;
    text-align: left;

    &.enabled {
        color: black;
        cursor: pointer;
    }

    .inner {
        margin: 0.2em 1em;
    }

    &.enabled:hover {
        background-color: #69ccef;
        color: white;
    }
}

</style>
