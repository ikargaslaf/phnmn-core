import {model, property, hasMany, hasOne} from '@loopback/repository';
import {NftItem} from '.';
import {Sales} from './sales.model';
import {Listing} from './listing.model';

@model()
export class Ape extends NftItem {
  @property({
    type: 'number',
    default: ''
  })
  rarity?: number;

  @property({
    type: 'number',
    default: ''
  })
  mask?: number;

  @property({
    type: 'number',
    default: ''
  })
  hat?: number;

  @property({
    type: 'number',
    default: ''
  })
  glasses?: number;

  @property({
    type: 'number',
    default: ''
  })
  jewerly?: number;

  @property({
    type: 'number',
    default: ''
  })
  clothes?: number;

  @property({
    type: 'number',
    default: ''
  })
  tatoos?: number;

  @hasMany(() => Sales)
  sales: Sales[];

  @hasOne(() => Listing)
  listing: Listing;

  constructor(data?: Partial<Ape>) {
    super(data);
  }
}

export interface ApeRelations {
  // describe navigational properties here
}

export type ApeWithRelations = Ape & ApeRelations;
