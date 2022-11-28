export enum Events {
  INIT = 'Initialized',
  MINT = 'Mint',
  ROUTER_LISTED = 'ListItem',
  ROUTER_SOLD = 'BuyItem',
  ROUTER_UPDATED = 'UpdateListing',
  ROUTER_CANCELED = 'CancelListing',
  AUCTION_LISTED = 'ListOnAuction',
  AUCTION_BIDDED = 'Bid',
  AUCTION_CLAIM_ITEM = 'ClaimItem',
  AUCTION_CLAIM_PAYMENT = 'ClaimPayment'
}

export enum Contracts {
  COLLECTION = 'Collection',
  ROUTER = 'Router',
  AUCTION = 'EnglishAuction'
}

export const RARITY = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
