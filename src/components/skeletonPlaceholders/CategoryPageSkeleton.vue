<template>
  <section class="px-2-sm-and-down">
    <v-layout
      row
      wrap
      justify-space-between
      class="content"
    >
      <v-layout
        v-if="getIsDesktop"
        column
        class="filters"
      >
        <div
          v-for="(f, i) in 7"
          :key="`filter-${i}`"
          class="skeleton-placeholder filters__item"
        ></div>
        <div class="skeleton-placeholder filters__item_extra-height"></div>
      </v-layout>
      <v-layout
        row
        wrap
        justify-space-between
        mb-4
        class="products"
        sm12
      >
        <div
          v-for="(p, i) in 12"
          :key="`product-${i}`"
          class="skeleton-placeholder products__item"
        ></div>
      </v-layout>
    </v-layout>
  </section>
</template>

<script>
export default {
  name: 'CategoryPageSkeleton'
}
</script>

<style lang="scss" scoped>
  .breadcrumb-item {
    width: 85px;
    height: 15px;
    margin-right: 10px;
  }

  .content {
    margin-top: 25px;
  }

  .filters {
    width: 25%;

    &__item {
      height: 20px;
      margin-bottom: 10px;

      &:nth-child(2n+1) {
        width: 85%;
      }

      &:nth-child(2n) {
        width: 90%;
      }

      &:nth-child(3n) {
        width: 87%;
      }

      &_extra-height {
        width: 85%;
        height: 45px;
        margin-top: 20px;
      }
    }
  }

  .products {
    width: 60%;

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
