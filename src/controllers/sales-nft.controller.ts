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
  Nft,
} from '../models';
import {SalesRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('jwt')

export class SalesNftController {
  constructor(
    @repository(SalesRepository)
    public salesRepository: SalesRepository,
  ) { }

  @get('/sales/{id}/nft', {
    responses: {
      '200': {
        description: 'Nft belonging to Sales',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Nft)},
          },
        },
      },
    },
  })
  async getNft(
    @param.path.number('id') id: typeof Sales.prototype.id,
  ): Promise<Nft> {
    return this.salesRepository.nft(id);
  }
}
