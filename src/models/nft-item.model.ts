import {Entity, model, property} from '@loopback/repository';

@model()
export class NftItem extends Entity {
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
    type: 'string',
  })
  contractAddress?: string;

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

  @property({
    type: 'boolean',
  })
  onSale?: boolean;

  @property({
    type: 'boolean',
  })
  onAuction?: boolean;


  constructor(data?: Partial<NftItem>) {
    super(data);
  }
}

export interface NftItemRelations {
  // describe navigational properties here
}

export type NftItemWithRelations = NftItem & NftItemRelations;
