import {Entity, model, property, hasOne} from '@loopback/repository';
import {Attributes} from './attributes.model';

@model()
export class NfTitem extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

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

  @hasOne(() => Attributes)
  attributes: Attributes;

  constructor(data?: Partial<NfTitem>) {
    super(data);
  }
}

export interface NfTitemRelations {
  // describe navigational properties here
}

export type NfTitemWithRelations = NfTitem & NfTitemRelations;
