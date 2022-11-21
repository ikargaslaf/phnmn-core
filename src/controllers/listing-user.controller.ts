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
  User,
} from '../models';
import {ListingRepository} from '../repositories';

export class ListingUserController {
  constructor(
    @repository(ListingRepository)
    public listingRepository: ListingRepository,
  ) { }

  @get('/listings/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Listing',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Listing.prototype.id,
  ): Promise<User> {
    return this.listingRepository.user(id);
  }
}
