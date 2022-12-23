import {model, property, hasMany, hasOne, Entity} from '@loopback/repository';
import {Sales} from './sales.model';
import {Listing} from './listing.model';
import {ApeAttributes} from './ape-attributes.model';

@model()
export class Nft extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    default: ''
  })
  tokenId?: string;

  @property({
    type: 'string',
    default: ''
  })
  contractAddress?: string;

  @property({
    type: 'string',
    default: ''
  })
  name?: string;

  @property({
    type: 'string',
    default: ''
  })
  description?: string;

  @property({
    type: 'string',
    default: ''
  })
  image?: string;

  @property({
    type: 'boolean',
    default: 'false'
  })
  onSale?: boolean;

  @property({
    type: 'boolean',
    default: 'false'
  })
  onAuction?: boolean;

  @hasMany(() => Sales)
  sales: Sales[];

  @hasOne(() => Listing)
  listing: Listing;

  @hasOne(() => ApeAttributes)
  apeAttributes: ApeAttributes;

  constructor(data?: Partial<Nft>) {
    super(data);
  }
}

export interface NftRelations {
  // describe navigational properties here
}

export type NftWithRelations = Nft & NftRelations;
