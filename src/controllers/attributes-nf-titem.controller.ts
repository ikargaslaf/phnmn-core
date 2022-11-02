import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Attributes, NfTitem} from '../models';
import {AttributesRepository} from '../repositories';

export class AttributesNfTitemController {
  constructor(
    @repository(AttributesRepository)
    public attributesRepository: AttributesRepository,
  ) {}

  @get('/attributes/{id}/nf-titem', {
    responses: {
      '200': {
        description: 'NfTitem belonging to Attributes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(NfTitem)},
          },
        },
      },
    },
  })
  async getNfTitem(
    @param.path.string('id') id: typeof Attributes.prototype.id,
  ): Promise<NfTitem> {
    return this.attributesRepository.nfTitem(id);
  }
}
