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
import {NFTitem, Attributes} from '../models';
import {NFTitemRepository} from '../repositories';

export class NfTitemAttributesController {
  constructor(
    @repository(NFTitemRepository)
    protected NFTitemRepository: NFTitemRepository,
  ) {}

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
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Attributes>,
  ): Promise<Attributes> {
    return this.NFTitemRepository.attributes(id).get(filter);
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
    @param.path.string('id') id: typeof NFTitem.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attributes, {
            title: 'NewAttributesInNfTitem',
            exclude: ['id'],
            optional: ['NFTitemId'],
          }),
        },
      },
    })
    attributes: Omit<Attributes, 'id'>,
  ): Promise<Attributes> {
    return this.NFTitemRepository.attributes(id).create(attributes);
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
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attributes, {partial: true}),
        },
      },
    })
    attributes: Partial<Attributes>,
    @param.query.object('where', getWhereSchemaFor(Attributes))
    where?: Where<Attributes>,
  ): Promise<Count> {
    return this.NFTitemRepository.attributes(id).patch(attributes, where);
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
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Attributes))
    where?: Where<Attributes>,
  ): Promise<Count> {
    return this.NFTitemRepository.attributes(id).delete(where);
  }
}
