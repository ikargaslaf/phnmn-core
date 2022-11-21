import {Entity, model, property, hasOne} from '@loopback/repository';
import {Attributes} from './attributes.model';

@model()
export class NFTitem extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  tokenId?: number;

  @property({
    type: 'number',
  })
  rarity?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  image?: string;

  constructor(data?: Partial<NFTitem>) {
    super(data);
  }
}

export interface NFTitemRelations {
  // describe navigational properties here
}

export type NfTitemWithRelations = NFTitem & NFTitemRelations;
