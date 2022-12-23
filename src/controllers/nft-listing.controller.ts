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
  Nft,
  Listing,
} from '../models';
import {NftRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class ApeListingController {
  constructor(
    @repository(NftRepository) protected NftRepository: NftRepository,
  ) { }

  @authenticate('jwt')
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
    return this.NftRepository.listing(id).get(filter);
  }
}
