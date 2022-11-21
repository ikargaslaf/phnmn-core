import {Entity, model, property} from '@loopback/repository';

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


  constructor(data?: Partial<Sales>) {
    super(data);
  }
}

export interface SalesRelations {
  // describe navigational properties here
}

export type SalesWithRelations = Sales & SalesRelations;
