import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  NfTitem,
  Attributes,
} from '../models';
import {NfTitemRepository} from '../repositories';

export class NfTitemAttributesController {
  constructor(
    @repository(NfTitemRepository) protected nfTitemRepository: NfTitemRepository,
  ) { }

  @get('/nf-titems/{id}/attributes', {
    responses: {
      '200': {
        description: 'NfTitem has one Attributes',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Attributes),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Attributes>,
  ): Promise<Attributes> {
    return this.nfTitemRepository.attributes(id).get(filter);
  }

  @post('/nf-titems/{id}/attributes', {
    responses: {
      '200': {
        description: 'NfTitem model instance',
        content: {'application/json': {schema: getModelSchemaRef(Attributes)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof NfTitem.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attributes, {
            title: 'NewAttributesInNfTitem',
            exclude: ['id'],
            optional: ['nfTitemId']
          }),
        },
      },
    }) attributes: Omit<Attributes, 'id'>,
  ): Promise<Attributes> {
    return this.nfTitemRepository.attributes(id).create(attributes);
  }

  @patch('/nf-titems/{id}/attributes', {
    responses: {
      '200': {
        description: 'NfTitem.Attributes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attributes, {partial: true}),
        },
      },
    })
    attributes: Partial<Attributes>,
    @param.query.object('where', getWhereSchemaFor(Attributes)) where?: Where<Attributes>,
  ): Promise<Count> {
    return this.nfTitemRepository.attributes(id).patch(attributes, where);
  }

  @del('/nf-titems/{id}/attributes', {
    responses: {
      '200': {
        description: 'NfTitem.Attributes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Attributes)) where?: Where<Attributes>,
  ): Promise<Count> {
    return this.nfTitemRepository.attributes(id).delete(where);
  }
}
