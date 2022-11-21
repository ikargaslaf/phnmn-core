import {model, property} from '@loopback/repository';
import {NftItem} from '.';

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


  constructor(data?: Partial<Ape>) {
    super(data);
  }
}

export interface ApeRelations {
  // describe navigational properties here
}

export type ApeWithRelations = Ape & ApeRelations;
