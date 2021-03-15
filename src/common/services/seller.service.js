import { makeServiceRequest } from './common-service-functionality'

export const SellerService = {
  getSeller (sellerId, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/pages/shops/${sellerId}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: SellerService.getSeller(),' +
      ' REQUEST: GET - /stores/{locale}/pages/shops/{query_id}'
    )
  }
}
