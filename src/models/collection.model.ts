import {Entity, model, property} from '@loopback/repository';

@model()
export class Collection extends Entity {
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
  address: string;

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
    type: 'string',
  })
  totalValue?: string;

  @property({
    type: 'string',
  })
  floorPrice?: string;

  @property({
    type: 'string',
  })
  listedProsent?: string;

  @property({
    type: 'string',
  })
  createdAt?: string;

  @property({
    type: 'string',
  })
  updatedAt?: string;


  constructor(data?: Partial<Collection>) {
    super(data);
  }
}

export interface CollectionRelations {
  // describe navigational properties here
}

export type CollectionWithRelations = Collection & CollectionRelations;
