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
  Ape,
} from '../models';
import {ListingRepository} from '../repositories';

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
            schema: {type: 'array', items: getModelSchemaRef(Ape)},
          },
        },
      },
    },
  })
  async getApe(
    @param.path.number('id') id: typeof Listing.prototype.id,
  ): Promise<Ape> {
    return this.listingRepository.ape(id);
  }
}
