<template>
  <div>
    <div
      v-if="text"
      class="toggleable"
      :class="{ 'full-text': isToggled }"
      :style="{ 'max-height': !isToggled && useToggler ? maxHeight + 'px' : 'inherit', 'overflow': 'hidden' }"
    >
      <div
        class="description-wrap"
        :class="className"
        v-html="text"
      ></div>
      <span
        v-if="!isToggled && useToggler && !isFullText"
        class="toggler-fx"
      ></span>
    </div>
    <ul
      v-if="items"
      class="pl-3"
    >
      <li
        v-for="(item, index) of items"
        v-show="(index < maxItems) || isToggled"
        :key="item + index"
        class="body-1"
      >
        <span v-html="item"></span>
        <slot :item="item"></slot>
      </li>
    </ul>
    <span
      v-if="useToggler && !isFullText"
      class="pointer d-inline-block pt-2 toggle-btn vidaxl-link-2"
      @click="isToggled = !isToggled"
    >
      {{ localize(isToggled ? 'product.see_less' : 'product.see_more') }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ToggleMore',
  props: {
    text: {
      type: String
    },
    items: {
      type: Array
    },
    maxHeight: [String, Number],
    maxItems: [String, Number],
    maxLength: {
      type: Number,
      default: 250
    },
    scaleFactor: {
      type: Number,
      default: 2
    },
    isFullText: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: 'body-1'
    }
  },
  data () {
    return {
      isToggled: false
    }
  },
  computed: {
    useToggler () {
      return (this.text && (this.text.length / this.maxLength >= this.scaleFactor)) ||
          (this.items && this.items.length > this.maxItems)
    }
  }
}
</script>

<style lang="scss">
  @import "colors";

  .toggleable {
    position: relative;

    * {
      margin: 0 !important;
    }

    .toggler-fx {
      position: absolute;
      bottom: 0;
      display: block;
      width: 100%;
      height: 30px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
      filter: progid:dximagetransform.microsoft.gradient.gradient(startColorstr='#00ffffff', endColorstr='#ffffff', GradientType=0);
    }
  }
</style>
