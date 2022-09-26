<template>
  <ul class="context-menu" v-if="visible" :style="{'top': top + 'px', 'left': left + 'px'}" v-click-away="close" ref="menu">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import { mixin as VueClickAway } from "vue3-click-away"

export default defineComponent({
    name: "ContextMenu",
    mixins: [VueClickAway],

    data() {
        return {
            visible: false,
            top: 0,
            left: 0
        }
    },

    methods: {
        show(event: MouseEvent) {
            this.left = event.clientX
            this.top = event.clientY
            this.visible = true

            this.$nextTick(() => {
                const rect = (this.$refs.menu as HTMLElement).getBoundingClientRect()
                rect.x = this.left
                rect.y = this.top

                if (rect.right > window.innerWidth) {
                    if (rect.x - rect.width < 0) {
                        this.left = window.innerWidth - rect.width
                    } else {
                        this.left = rect.x - rect.width
                    }
                }

                if (rect.bottom > window.innerHeight) {
                    if (rect.y - rect.height < 0) {
                        this.top = window.innerHeight - rect.height
                    } else {
                        this.top = rect.y - rect.height
                    }
                }
            })
        },

        close() {
            this.visible = false
            this.$emit("contextMenuClosed")
        }
    }
})
</script>

<style scoped lang="scss">

.context-menu {
  position: fixed;
  border: 1px solid gray;
  background-color: white;
  margin: 0;
  padding: 0;
  z-index: 100000;
  box-shadow: 3px 3px 0.5em 0 #9a9a9aaa;
  font-size: 1.3em;
}

</style>
