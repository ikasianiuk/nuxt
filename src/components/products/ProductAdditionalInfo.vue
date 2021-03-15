<template>
  <ab-test-wrapper
    :test-name="abFoldedInfo"
    :parent="this"
  >
  <v-layout
    row
    wrap
  >
    <v-flex sm12>
      <v-card class="mb-2 elevation-0">
        <v-card-title class="pa-2">
          <h2 class="product-description__title subheading-2">{{ localize('product.description') }}</h2>
        </v-card-title>
        <v-card-text class="pa-2 product-description__text">
          <template v-if="description">
            <toggle-more
              :is-full-text="true"
              :text="description"
              class="toggle_description"
            />
          </template>
          <div
            v-else
            class="body-1"
          >
            {{ localize('product.no_description') }}
          </div>
        </v-card-text>
      </v-card>
      <v-card
        v-if="filteredSpecifications.length || properties"
        class="elevation-0"
      >
        <v-card-title class="pa-2">
          <h2 class="product-specifications__title subheading-2">{{ localize('product.specifications') }}</h2>
        </v-card-title>
        <v-card-text class="pa-2 product-specifications__text">
          <div
            v-if="properties"
            @click="showLegalDocDescr"
            v-html="fullProperties"
          ></div>
          <toggle-more
            v-if="filteredSpecifications.length"
            :max-items="filteredSpecifications.length"
            :items="filteredSpecifications"
          />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
  </ab-test-wrapper>
</template>

<script>
import ToggleMore from '@/components/toggleMore/ToggleMore'
import VCard from 'vuetify/es5/components/VCard/VCard'
import { VCardTitle, VCardText } from 'vuetify/es5/components/VCard'
import AbTestWrapper from '@/abtests/AbTestWrapper'

export default {
  name: 'ProductAdditionalInfo',
  components: {
    VCard,
    VCardTitle, VCardText,
    ToggleMore,
    AbTestWrapper
  },
  props: {
    specifications: {
      type: Array,
      default: () => []
    },
    description: String,
    // field with html string for specifications for PDP
    properties: String,
    // there is no way on BE side to localize brand text without additional requests, so we need to add this info
    additionalProperties: {
      type: Object,
      validator (value) {
        const { ean, sku, brand } = value
        return ean && sku && brand
      },
      default: () => ({})
    }
  },
  computed: {
    getAddditionalPropertiesText () {
      const { ean, sku, brand } = this.additionalProperties
      const eanText = `EAN: ${ean}`
      const skuText = `SKU: ${sku}`
      const brandText = `${this.localize('product.brand')}: ${brand}`

      return { eanText, skuText, brandText }
    },
    filteredSpecifications () {
      const nonEmptySpecs = this.specifications.filter(Boolean)

      if (!nonEmptySpecs.length) return []

      const { eanText, skuText, brandText } = this.getAddditionalPropertiesText
      return [...nonEmptySpecs, eanText, skuText, brandText]
    },
    fullProperties () {
      if (!this.properties && this.properties.includes('</ul>')) return this.properties

      const strList = this.properties.split('</ul>')[0]
      const { eanText, skuText, brandText } = this.getAddditionalPropertiesText

      return `${strList + `<li>${eanText}</li>` + `<li>${skuText}</li>` + `<li>${brandText}</li>`}</ul>`
    },
    // AB-test related
    // this logic allow run test only on Mobile
    abFoldedInfo () {
      return this.getIsMobile ? 'pdp_folded_info' : 'none'
    }
  },
  mounted () {
    // for some products there is a legal document info inside 'properties' field with html string
    // this logic is for separating title and description of legal document, styling correctly and making possible
    // to hide/show description when clicking on title
    this.formatLegalDocumentInfo()
  },
  methods: {
    formatLegalDocumentInfo () {
      // legal doc info is wrapped with class 'legalDocument'
      const legalDocEl = document.querySelector('.legalDocument')

      if (!legalDocEl) return

      // there is a <br> tag coming from cms between title and description
      const [title, ...description] = legalDocEl.innerHTML.split('<br>')
      // create the element that will be replaced
      const newLegalDocEl = document.createElement('li')
      newLegalDocEl.innerHTML = `<span class="legal-doc__title pointer underline">${title}</span><span class="legal-doc__description">${description}</span>`

      legalDocEl.parentNode.replaceChild(newLegalDocEl, legalDocEl)
    },
    showLegalDocDescr (e) {
      if (!e.target.matches('.legal-doc__title')) return

      document.querySelector('.legal-doc__description').classList.toggle('d-block')
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .legal-doc__description {
    display: none;
  }

  .product-specifications__text {
    /deep/ p {
      margin-bottom: 0;
    }

    /deep/ li:empty {
      display: none;
    }

    /deep/ ul + ul {
      margin-top: 16px;
    }
  }

</style>
