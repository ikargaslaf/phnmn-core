import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'tech'}},
})
export class Tech extends Entity {
  @property({
    type: 'string',
    required: true,
    id: 1,
    generated: true,
    postgresql: {
      columnName: 'id',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  id: string;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {
      columnName: 'blocknumber',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  blocknumber: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Tech>) {
    super(data);
  }
}

export interface TechRelations {
  // describe navigational properties here
}

export type TechWithRelations = Tech & TechRelations;
