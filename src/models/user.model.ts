import {Model, model, property} from '@loopback/repository';

@model()
export class User extends Model {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
  })
  telegram?: string;

  @property({
    type: 'string',
  })
  banner?: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
