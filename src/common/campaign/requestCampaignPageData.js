import { setPageCache } from '@/helpers/setPageCache'
import { getParsedCampaignQueryWithAttr } from '@/helpers/getParsedCampaignQueryWithAttr'

export default async function ({ app, store, route, error, res }) {
  const pageType = 'campaign'
  const url_key = route.fullPath.slice(1).split('?')[0]
  const id = route.query.category_path || route.query.cat

  const requestData = {
    query: route.query,
    params: {
      url_key: url_key
    },
    pageType
  }

  try {
    await store.dispatch('campaign/fetchCampaignPageData', url_key)

    const { query } = store.state.campaign.campaignPageData

    requestData.params.additionalQuery = getParsedCampaignQueryWithAttr(query, id)

    await store.dispatch('products/fetchProducts', requestData)

    id && await store.dispatch('category/fetchCategoryData', id)

    store.commit('category/setStructuredData', { products: store.state.products.products })

    setPageCache(res, 'LANDING', app.$device)

    return {
      page_type: pageType,
      url_key,
      title: store.state.campaign.campaignPageData.title
    }
  } catch (e) {
    error(e.$nuxtPayload || { statusCode: 500, errorMessage: 'InternalError' })
  }
}
