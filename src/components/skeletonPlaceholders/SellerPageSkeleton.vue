<template>
  <section class="px-2-sm-and-down">
    <v-layout
      row
      wrap
      justify-space-between
      class="content"
    >
      <v-layout
        row
        wrap
        justify-space-between
        mb-4
        class="products"
        sm12
      >
        <div
          v-for="(p, i) in 20"
          :key="`product-${i}`"
          class="skeleton-placeholder products__item"
        ></div>
      </v-layout>
    </v-layout>
  </section>
</template>

<script>
export default {
  name: 'SellerPageSkeleton'
}
</script>

<style lang="scss" scoped>
  .content {
    margin-top: 25px;
  }

  .products {
    width: 100%;

    &__item {
      width: 24%;
      height: 170px;
      margin-bottom: 10px;

      @media screen and (max-width: 1261px) {
        width: 32%;
      }

      @media screen and (max-width: 600px) {
        width: 49%;
      }
    }
  }
</style>
