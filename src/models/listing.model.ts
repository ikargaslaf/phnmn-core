import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Nft} from './nft.model';

@model()
export class Listing extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  sellerAddress: string;

  @property({
    type: 'string',
  })
  tokenId?: string;

  @property({
    type: 'string',
  })
  price?: string;

  @belongsTo(() => Nft)
  nftId: number;

  constructor(data?: Partial<Listing>) {
    super(data);
  }
}

export interface ListingRelations {
  // describe navigational properties here
}

export type ListingWithRelations = Listing & ListingRelations;
