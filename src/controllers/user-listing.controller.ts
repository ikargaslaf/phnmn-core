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
  User,
  Listing,
} from '../models';
import {UserRepository} from '../repositories';

export class UserListingController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/listings', {
    responses: {
      '200': {
        description: 'Array of User has many Listing',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Listing)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Listing>,
  ): Promise<Listing[]> {
    return this.userRepository.listings(id).find(filter);
  }

  @post('/users/{id}/listings', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Listing)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Listing, {
            title: 'NewListingInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) listing: Omit<Listing, 'id'>,
  ): Promise<Listing> {
    return this.userRepository.listings(id).create(listing);
  }

  @patch('/users/{id}/listings', {
    responses: {
      '200': {
        description: 'User.Listing PATCH success count',
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
    return this.userRepository.listings(id).patch(listing, where);
  }

  @del('/users/{id}/listings', {
    responses: {
      '200': {
        description: 'User.Listing DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Listing)) where?: Where<Listing>,
  ): Promise<Count> {
    return this.userRepository.listings(id).delete(where);
  }
}
