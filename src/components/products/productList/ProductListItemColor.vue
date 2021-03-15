<template>
    <v-flex
      class="mt-2 pos-relative color_item"
    >
      <span
         v-for="colorItem of colorOptions"
         :key="colorItem.ean"
         class="color_item_circle d-inline-block"
         :class="{'active-color': colorItem.ean === productEan}"
         :style="{ backgroundColor: colorItem.color_RGB, backgroundImage: colorItem.color_RGB }"
         @click.prevent="changeProductColor(colorItem)"
      ></span>
      <span
        v-if="numberOfRemainingItems"
        class="remaining_colors pos-absolute"
      >
        +{{ numberOfRemainingItems }}
      </span>
    </v-flex>
</template>

<script>
export default {
  name: 'ProductListItemColor',
  props: {
    productEan: {
      type: String,
      required: true
    },
    productItemColors: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      numberOfRemainingItems: 0
    }
  },
  computed: {
    colorOptions () {
      const colorsLength = this.productItemColors.length

      if (colorsLength <= 10) {
        return this.productItemColors
      }

      const cutColorsArray = [...this.productItemColors]

      this.setNumberOfRemainingItems(colorsLength)

      return cutColorsArray.slice(0, 9)
    }
  },
  methods: {
    setNumberOfRemainingItems (arrayLength) {
      this.numberOfRemainingItems = arrayLength - 9
    },
    changeProductColor (colorItem) {
      this.$emit('change-product-color', colorItem)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "colors";

  .color_item {
    max-width: none;
    margin-left: -7%;
  }

  .color_item_circle {
    width: 25px;
    height: 25px;
    margin-left: 6.5%;
    cursor: pointer;
    border: 1px solid $grey-medium;
    border-radius: 50%;

    &.active-color {
      border: 1px solid $black;
    }
  }

  .remaining_colors {
    right: 6px;
    bottom: 7px;
  }
</style>
