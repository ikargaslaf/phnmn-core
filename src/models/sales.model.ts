import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Nft} from './nft.model';

@model()
export class Sales extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  price?: string;

  @property({
    type: 'string',
  })
  timestamp?: string;

  @belongsTo(() => Nft)
  nftId: number;

  constructor(data?: Partial<Sales>) {
    super(data);
  }
}

export interface SalesRelations {
  // describe navigational properties here
}

export type SalesWithRelations = Sales & SalesRelations;
