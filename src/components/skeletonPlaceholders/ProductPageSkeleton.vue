<template>
  <section>
    <v-layout
      row
      justify-space-between
      wrap
    >
      <v-flex
        xs12
        md7
      >
        <v-flex class="skeleton-placeholder product-image" />
        <v-flex class="product-description">
          <div
            v-for="(l, i) in 5"
            :key="`line-${i}`"
            class="skeleton-placeholder product-description__line"
          ></div>
        </v-flex>
      </v-flex>

      <v-flex
        class="skeleton-placeholder product-info"
        xs12
        md4
        flat
      />
    </v-layout>
  </section>
</template>

<script>
export default {
  name: 'ProductPageSkeleton'
}
</script>

<style scoped lang="scss">
  .product-image {
    height: 460px;
  }

  .product-info {
    height: 300px;
  }

  .product-description {
    margin: 30px 0;

    &__line {
      height: 20px;
      margin-bottom: 10px;

      &:nth-child(1) {
        width: 70%;
      }

      &:nth-child(2) {
        width: 50%;
      }

      &:nth-child(3) {
        width: 80%;
      }

      &:nth-child(4) {
        width: 40%;
      }

      &:nth-child(5) {
        width: 45%;
      }
    }
  }
</style>
