<template>
  <div>
    <slot v-if="isComponentMounted">
    </slot>
    <div
      v-else
      :style="placeholderStyle"
    ></div>
  </div>
</template>

<script>
/*
The main goal of this component is to display the placeholder for those elements
that cannot be correctly displayed during SSR
*/
export default {
  name: 'SsrBlockSkeleton',
  props: {
    width: {
      type: [Number, String],
      default: 0
    },
    height: {
      type: [Number, String],
      default: 0
    },
    color: {
      type: String,
      default: 'transparent'
    }
  },
  computed: {
    placeholderStyle () {
      return {
        backgroundColor: this.color,
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  }
}
</script>
