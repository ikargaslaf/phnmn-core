export enum Events {
  INIT = 'Initialized',
  MINT = 'Mint',
  ROUTER_LISTED = 'ItemListed',
  ROUTER_SOLD = 'ItemSold',
  ROUTER_UPDATED = 'ItemUpdated',
  ROUTER_CANCELED = 'ItemCanceled',
  AUCTION_LISTED = 'Listed',
  AUCTION_BIDDED = 'Bidded',
  AUCTION_CLAIM_ITEM = 'ItemClaimed',
  AUCTION_CLAIM_PAYMENT = 'PaymentClaimed'
}

export enum Contracts {
  COLLECTION = 'Collection',
  ROUTER = 'Router',
  AUCTION = 'EnglishAuction'
}

export const RARITY = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
