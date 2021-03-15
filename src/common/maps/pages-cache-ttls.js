// TTLs in seconds
export const pagesCacheTTLs = {
  // product details page
  PDP: 600, // 10m
  // products listing pge
  PLP: 3600, // 1h,
  // home page
  HP: 1800, // 30m,
  // cms or landing/campaign page
  LANDING: 1800, // 30m,
  // for all static assets located in /static/ folder
  STATIC: 86400, // 1d,
  // for cross-selling api on PDP
  CROSS_SELLING_API: 600 // 10m
}
