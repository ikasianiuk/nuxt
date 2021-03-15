import { makeServiceRequest } from './common-service-functionality'

export default {
  getAuctionProductsList ({ page, limit }, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/auctions?page=${page}&limit=${limit}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: AuctionService.getAuctionListProducts(),' +
      'ROUTE: GET - /stores/{locale}/auctions'
    )
  },
  getAuctionItemWinner ({ id }, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/auctions/${id}/winner`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: AuctionService.getAuctionItemWinner(),' +
      ' REQUEST: GET - /stores/{locale}/auctions/{auction_id}/winner'
    )
  },
  getAuctionItemById (id, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/auctions/${id}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: AuctionService.getAuctionItemById(),' +
      ' REQUEST: GET - /stores/{locale}/auctions/{auction_id}'
    )
  },
  refreshAuctionItemById (id, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/auctions/${id}/refresh`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: AuctionService.refreshAuctionItemById(),' +
      ' REQUEST: GET - /stores/{locale}/auctions/{auction_id}/refresh'
    )
  },
  getAllBidsForAuctionItem ({ id }, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'get',
      url: `/stores/${locale}/auctions/${id}/bids`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    'METHOD: AuctionService.getAllBidsForAuctionItem(),' +
      ' REQUEST: GET - /stores/{locale}/auctions/{auction_id}/bids'
    )
  },
  placeAuctionBid ({ id, bid_amount }, { locale, axios }) {
    return makeServiceRequest(axios, {
      method: 'post',
      url: `/stores/${locale}/auctions/${id}/bids`,
      data: { bid_amount },
      headers: { 'Content-Type': 'application/json' }
    },
    'METHOD: AuctionService.placeAuctionBid(),\n' +
      ' REQUEST: POST - /stores/{locale}/auctions/{auction_id}/bids\n'
    )
  }
}
