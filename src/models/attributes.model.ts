import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Ape} from './ape.model';

@model({settings: {strict: false}})
export class Attributes extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

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
  apeId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Attributes>) {
    super(data);
  }
}

export interface AttributesRelations {
  // describe navigational properties here
}

export type AttributesWithRelations = Attributes & AttributesRelations;
