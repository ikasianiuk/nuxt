import { mapActions, mapGetters } from 'vuex'
import { generateAddToCartSchema } from '@/common/structured-data/cart'

export const addToCartMixin = {
  data () {
    return {
      isAddButtonClicked: false
    }
  },
  computed: {
    ...mapGetters('customer', ['getCustomerId']),
    ...mapGetters('abtests', ['getIsAddToCartRedirect'])
  },
  methods: {
    ...mapActions('cart', ['addItemToStorage']),
    pushGoogleTagAddToCart ({ sku, price }) {
      this.$pushGoogleTag({
        event: 'addToCart',
        customerId: this.getCustomerId,
        productId: sku,
        price,
        stockStatus: `On stock`,
        time: new Date().toISOString()
      })
    },
    async addToCart (product) {
      this.isAddButtonClicked = true

      const productPrice = product.special_price || product.price
      const { sku, ean, quantity = 1, title: name, seller } = product

      try {
        await this.addItemToStorage({
          id: Number(sku),
          ean,
          quantity,
          price: productPrice,
          name,
          seller
        })

        const productAddToCartSchema = generateAddToCartSchema.call(
          this,
          {
            ...product,
            vat: this.vat,
            currency: this.currency,
            host: this.host,
            routes: this.routes
          }
        )

        this.pushGoogleTagAddToCart({ sku, price: productPrice })
        this.$pushArtefactAction(productAddToCartSchema)

        // TODO [AB-tests] remove or apply when ab-tests will be processed
        // https://jira.vidaxl.com/browse/PWA-4021
        if (this.getIsAddToCartRedirect) {
          this.$router.push({ name: 'cart' })
        } else {
          this.$nuxt.$emit('add-to-cart')
        }
      } catch (err) {
        this.$nuxt.$emit('notify', this.localize('product.not_added'), 'error')
      }

      this.isAddButtonClicked = false
    }
  }
}
