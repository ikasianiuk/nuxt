import { makeServiceRequest, queryGenerator } from './common-service-functionality'

export default {
  getCampaignProductListByLandingUrlKey (query, { locale, axios }) {
    const finalQuery = encodeURI(queryGenerator(query))

    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/pages/product-listings?${finalQuery}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: CampaignService.getCampaignProductListByLandingUrlKey(),' +
      ' REQUEST: GET - /stores/{locale}/pages/product-listings?{page_id}'
    )
  }
}
