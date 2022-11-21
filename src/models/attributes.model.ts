import {Entity, model, property, belongsTo} from '@loopback/repository';
import {NFTitem} from './nft-item.model';

@model()
export class Attributes extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  mask?: string;

  @property({
    type: 'string',
  })
  hat?: string;

  @property({
    type: 'string',
  })
  glasses?: string;

  @property({
    type: 'string',
  })
  jewerly?: string;

  @property({
    type: 'string',
  })
  clothes?: string;

  @property({
    type: 'string',
  })
  tatoos?: string;

  constructor(data?: Partial<Attributes>) {
    super(data);
  }
}

export interface AttributesRelations {
  // describe navigational properties here
}

export type AttributesWithRelations = Attributes & AttributesRelations;
