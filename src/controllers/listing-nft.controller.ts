import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Listing,
  Nft,
} from '../models';
import {ListingRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('jwt')

export class ListingApeController {
  constructor(
    @repository(ListingRepository)
    public listingRepository: ListingRepository,
  ) { }

  @get('/listings/{id}/ape', {
    responses: {
      '200': {
        description: 'Ape belonging to Listing',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Nft)},
          },
        },
      },
    },
  })
  async getApe(
    @param.path.number('id') id: typeof Listing.prototype.id,
  ): Promise<Nft> {
    return this.listingRepository.nft(id);
  }
}
