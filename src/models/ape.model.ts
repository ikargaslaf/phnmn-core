import {model, property, hasMany, hasOne, Entity} from '@loopback/repository';
import {NftItem} from '.';
import {Sales} from './sales.model';
import {Listing} from './listing.model';
import {Attributes} from './attributes.model';

@model()
export class Ape extends Entity {
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
    type: 'number',
    default: 0
  })
  rarity?: number;

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

  @hasOne(() => Attributes)
  attributes: Attributes;

  constructor(data?: Partial<Ape>) {
    super(data);
  }
}

export interface ApeRelations {
  // describe navigational properties here
}

export type ApeWithRelations = Ape & ApeRelations;
