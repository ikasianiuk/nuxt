<template>
  <v-layout
    row
    wrap
  >
    <v-expansion-panel
      class="product-description__panel"
      expand
    >
      <v-flex class="full-width">
        <v-expansion-panel-content class="product-description__panel-item">
          <template v-slot:header>
            <h2 class="product-description__title subheading-2">{{ localize('product.description') }}</h2>
          </template>
          <v-card>
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
        </v-expansion-panel-content>

        <v-expansion-panel-content
          v-if="filteredSpecifications.length || properties"
          class="product-description__panel-item"
        >
          <template v-slot:header>
            <h2 class="product-specifications__title subheading-2">{{ localize('product.specifications') }}</h2>
          </template>
          <v-card>
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
        </v-expansion-panel-content>
      </v-flex>
    </v-expansion-panel>
  </v-layout>
</template>

<script>
import { VExpansionPanel, VExpansionPanelContent } from 'vuetify/es5/components/VExpansionPanel'

export default {
  name: 'AbProductAdditionalInfo',
  components: {
    VExpansionPanel,
    VExpansionPanelContent
  }
}
</script>

<style lang="scss" scoped>
  @import 'colors';

  .product-description__panel.v-expansion-panel {
    margin: 0 7px;
    box-shadow: none;

    /deep/ .v-expansion-panel__header {
      padding: 7px;

      i {
        color: #bbb !important;
      }
    }

    .product-description__panel-item.v-expansion-panel__container {
      margin-bottom: 11px;
      border: 1px solid $grey-light !important;
      border-radius: 5px;
    }
  }
</style>
