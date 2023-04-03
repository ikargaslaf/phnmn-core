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
  Sales,
} from '../models';
import {NftRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class NftSalesController {
  constructor(
    @repository(NftRepository) protected NftRepository: NftRepository,
  ) { }

  @authenticate('jwt')
  @get('/nft/{id}/sales', {
    responses: {
      '200': {
        description: 'Array of Nft has many Sales',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Sales)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Sales>,
  ): Promise<Sales[]> {
    return this.NftRepository.sales(id).find(filter);
  }
}
