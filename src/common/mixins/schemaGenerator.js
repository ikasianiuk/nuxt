import SchemaGenerator from '@/common/structured-data/schema-generator'

const generatorAndStoreRelation = {
  'webPage': 'products',
  'product': 'products',
  'productList': 'category',
  'breadcrumbs': 'breadcrumbs'
}
const pageNameAndStoreInfo = {
  'HomePage': 'info',
  'SearchPage': 'products',
  'WriteReviewPage': 'products',
  'AccountPage': 'customer',
  'AuctionPage': 'auction',
  'AuctionListPage': 'auction',
  'CampaignPage': 'campaign',
  'CartPage': 'cart',
  'CategoryPage': 'category',
  'CheckoutPage': 'checkout',
  'WssMainPage': 'wss',
  'WssCategoryPage': 'wss',
  'WssQuestionPage': 'wss',
  'LoginPage': 'customer',
  'OffersPage': 'products',
  'ProductPage': 'products',
  'SellerPage': 'seller',
  'LandingCmsPage': 'campaign'
}

const schemaGeneratorMixin = (generatorNames) => {
  return {
    data () {
      return {
        structuredData: null
      }
    },
    head () {
      return {
        ...this.getPageMetaInfo(),
        ...this.structuredData,
        changed: (newInfo) => {
          // push event only when script tags have been added
          if (newInfo.hasOwnProperty('script')) {
            this.$pushGoogleTag({
              event: 'Page Ready',
              pageUrl: this.route.path,
              routeName: this.route.name
            })
          }
        }
      }
    },
    computed: {
      pageName () {
        if (!this.$route.matched) return ''

        return this.$route.matched.map((r) => {
          return r.components.default.options.name
        })[0]
      }
    },
    async created () {
      try {
        const schemas = await Promise.all(this.getSchemas())
        const result = { script: [] }

        if (schemas.length) {
          for (let schema of schemas) {
            result.script.push({
              hid: 'json-ld-schema',
              type: 'application/ld+json',
              json: schema
            })
          }

          this.structuredData = result
        }
      } catch (e) {
        throw e
      }
    },
    methods: {
      getDefaultParamsForSchema () {
        return {
          url: this.route.path,
          locale: this.locale,
          host: this.host,
          routes: this.routes,
          route: this.route,
          vat: this.vat,
          currency: this.currency,
          ...this.pageBreadcrumbs && { breadcrumbs: this.pageBreadcrumbs }
        }
      },
      getPageMetaInfo () {
        const storeModuleNameForWebpage = pageNameAndStoreInfo[this.pageName]
        const getterName = `get${this.pageName}Head`
        const headInfo = this.$store.getters[`${storeModuleNameForWebpage}/${getterName}`] || {}

        return headInfo
      },
      getSchemas () {
        if (!generatorNames || !Array.isArray(generatorNames)) {
          console.error('Error in SchemaGenerator.js: generatorNames should be an Array')
          return []
        }

        const paramsForSchema = this.getDefaultParamsForSchema()
        let schemaPromises = []

        for (let generatorName of generatorNames) {
          let storeModuleName = generatorAndStoreRelation[generatorName] || generatorName
          let structuredDataState = this.$store.state[storeModuleName].structuredDataState
          let isWebpageGenerator = generatorName === 'webPage'
          let params = {
            ...paramsForSchema,
            ...structuredDataState,
            ...(isWebpageGenerator && this.getMataForWebPageType())
          }

          schemaPromises.push(SchemaGenerator(generatorName, params))
        }

        return schemaPromises
      },
      getMataForWebPageType () {
        const headInfo = this.getPageMetaInfo()

        if (!headInfo.meta) return {}

        const metaDescrObj = headInfo.meta.length && headInfo.meta.find(metaInfo => metaInfo.name === 'description' || metaInfo.name === 'og:description')
        const metaDescr = metaDescrObj && metaDescrObj.content
        const metaName = headInfo.title

        return {
          name: metaName,
          description: metaDescr
        }
      }
    }
  }
}

export default schemaGeneratorMixin
