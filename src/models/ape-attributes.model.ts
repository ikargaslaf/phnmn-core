import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Nft} from './nft.model';

@model({settings: {strict: false}})
export class ApeAttributes extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    default: 0
  })
  rarity?: number;

  @property({
    type: 'number',
    required: true,
  })
  body: number;

  @property({
    type: 'number',
    required: true,
  })
  head: number;

  @property({
    type: 'number',
    required: true,
  })
  costume: number;

  @property({
    type: 'number',
    required: true,
  })
  jewerly: number;

  @property({
    type: 'number',
  })
  nftId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ApeAttributes>) {
    super(data);
  }
}

export interface ApeAttributesRelations {
  // describe navigational properties here
}

export type AttributesWithRelations = ApeAttributes & ApeAttributesRelations;
