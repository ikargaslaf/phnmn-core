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
  Ape,
  Listing,
} from '../models';
import {ApeRepository} from '../repositories';

export class ApeListingController {
  constructor(
    @repository(ApeRepository) protected apeRepository: ApeRepository,
  ) { }

  @get('/apes/{id}/listing', {
    responses: {
      '200': {
        description: 'Ape has one Listing',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Listing),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Listing>,
  ): Promise<Listing> {
    return this.apeRepository.listing(id).get(filter);
  }

  @post('/apes/{id}/listing', {
    responses: {
      '200': {
        description: 'Ape model instance',
        content: {'application/json': {schema: getModelSchemaRef(Listing)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Ape.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Listing, {
            title: 'NewListingInApe',
            exclude: ['id'],
            optional: ['apeId']
          }),
        },
      },
    }) listing: Omit<Listing, 'id'>,
  ): Promise<Listing> {
    return this.apeRepository.listing(id).create(listing);
  }

  @patch('/apes/{id}/listing', {
    responses: {
      '200': {
        description: 'Ape.Listing PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Listing, {partial: true}),
        },
      },
    })
    listing: Partial<Listing>,
    @param.query.object('where', getWhereSchemaFor(Listing)) where?: Where<Listing>,
  ): Promise<Count> {
    return this.apeRepository.listing(id).patch(listing, where);
  }

  @del('/apes/{id}/listing', {
    responses: {
      '200': {
        description: 'Ape.Listing DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Listing)) where?: Where<Listing>,
  ): Promise<Count> {
    return this.apeRepository.listing(id).delete(where);
  }
}
