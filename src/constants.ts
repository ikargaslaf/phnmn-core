export enum Events {
  INIT = 'Initialized',
  MINT = 'Mint',
  ITEM_LISTED = 'ItemListed',
  ITEM_SOLD = 'ItemSold',
  ITEM_UPDATED = 'ItemUpdated',
  ITEM_CANCELED = 'ItemCanceled',
  LISTED = 'Listed',
  BIDDED = 'Bidded',
  SOLD = 'Sold',
}

export enum Contracts {
  COLLECTION = 'Collection',
  ROUTER = 'Router',
  AUCTION = 'EnglishAuction'
}

export const RARITY = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
