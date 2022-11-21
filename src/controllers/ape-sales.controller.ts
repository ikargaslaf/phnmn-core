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

  @post('/apes/{id}/sales', {
    responses: {
      '200': {
        description: 'Ape model instance',
        content: {'application/json': {schema: getModelSchemaRef(Sales)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Ape.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sales, {
            title: 'NewSalesInApe',
            exclude: ['id'],
            optional: ['apeId']
          }),
        },
      },
    }) sales: Omit<Sales, 'id'>,
  ): Promise<Sales> {
    return this.apeRepository.sales(id).create(sales);
  }

  @patch('/apes/{id}/sales', {
    responses: {
      '200': {
        description: 'Ape.Sales PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sales, {partial: true}),
        },
      },
    })
    sales: Partial<Sales>,
    @param.query.object('where', getWhereSchemaFor(Sales)) where?: Where<Sales>,
  ): Promise<Count> {
    return this.apeRepository.sales(id).patch(sales, where);
  }

  @del('/apes/{id}/sales', {
    responses: {
      '200': {
        description: 'Ape.Sales DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Sales)) where?: Where<Sales>,
  ): Promise<Count> {
    return this.apeRepository.sales(id).delete(where);
  }
}
