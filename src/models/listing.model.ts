import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Listing extends Entity {
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
  sellerAddress: string;

  @property({
    type: 'string',
  })
  tokenId?: string;

  @property({
    type: 'string',
  })
  price?: string;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Listing>) {
    super(data);
  }
}

export interface ListingRelations {
  // describe navigational properties here
}

export type ListingWithRelations = Listing & ListingRelations;
