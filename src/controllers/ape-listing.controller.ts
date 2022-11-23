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
}
