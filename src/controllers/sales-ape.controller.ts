import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Sales,
  Ape,
} from '../models';
import {SalesRepository} from '../repositories';

export class SalesApeController {
  constructor(
    @repository(SalesRepository)
    public salesRepository: SalesRepository,
  ) { }

  @get('/sales/{id}/ape', {
    responses: {
      '200': {
        description: 'Ape belonging to Sales',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ape)},
          },
        },
      },
    },
  })
  async getApe(
    @param.path.number('id') id: typeof Sales.prototype.id,
  ): Promise<Ape> {
    return this.salesRepository.ape(id);
  }
}
