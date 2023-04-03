import {Entity, model, property, belongsTo} from '@loopback/repository';
@model()
export class Auction extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  auctionId?: string;

  @property({
    type: 'string',
  })
  seller?: string;

  @property({
    type: 'string',
  })
  price?: string;

  @property({
    type: 'string',
  })
  startTime?: string;

  @property({
    type: 'string',
  })
  endTime?: string;

  @property({
    type: 'string',
  })
  lastBidder?: string;

  @property({
    type: 'string',
  })
  tokenId?: string;

  @property({
    type: 'string',
  })
  nftAddress?: string;


  constructor(data?: Partial<Auction>) {
    super(data);
  }
}

export interface AuctionRelations {
  // describe navigational properties here
}

export type AuctionWithRelations = Auction & AuctionRelations;
