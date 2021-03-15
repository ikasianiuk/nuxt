# AB tests

We are using Abtasty tool for ab-testing.

We can use Abtasty editor to create simple experiments like change button color, hide some elements, etc.
But complex AB tests we have to store in our code base.

So, for this ones Abtasty will trigger custom event to our APP and APP will apply particular changes.

Code that that will run Abtasty:

```
(function() {
    window.abtastyHelpers && window.abtastyHelpers.runAbTest('unique_abtest_id')
})();
```

A typical scenario for an ab test changes some layout and apply different styles.
For this purpose, I've created a mechanism that allows creating a special component for testing layout.
This component will have access to the parent component instance and you can change the only template.

All available tests should be imported in `@/abtests/all-tests.js` with specific ab test name that will be used in Abtasty.

How to create a new ab test:
1. Wrap content that you want to test using `AbTestWrapper`
```
<ab-test-wrapper>
...
  <product-variants
    v-if="productVariantsLength"
    :variant-list="formattedVariant"
    class="mt-3 mb-4"
    @variantChanged="goToProductVariant"
  />
  <product-price
    :price="+price"
    :special-price="+special_price"
  />
  <v-layout
    row
    wrap
  >
    <v-btn
      block
      :disabled="!in_stock || isAddButtonClicked"
      class="add-to-cart-btn primary white--text elevation-2 mt-4"
      @click="addToCart(productProps)"
    >
      <template>
        {{ localize('product.add_to_cart') }}
      </template>
    </v-btn>
  </v-layout>
...
</ab-test-wrapper>
```
2. Create a new component in `@/abtests/experiments/` and import in `@/abtests/all-tests.js`
3. Copy wrapped content and change what you need. See example `@/abtests/experiments/product/AbPdpOne`
4. That's all. When Abtasty trigger an event particular component will be rendered. (If you set correct ab test name in `@/abtests/all-tests.js`)

