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
  Sales,
} from '../models';
import {ApeRepository} from '../repositories';

export class ApeSalesController {
  constructor(
    @repository(ApeRepository) protected apeRepository: ApeRepository,
  ) { }

  @get('/apes/{id}/sales', {
    responses: {
      '200': {
        description: 'Array of Ape has many Sales',
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
    return this.apeRepository.sales(id).find(filter);
  }
}
