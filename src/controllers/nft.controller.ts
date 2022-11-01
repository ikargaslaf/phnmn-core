import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {NfTitem} from '../models';
import {NfTitemRepository} from '../repositories';
import {ContractsService} from '../services';
import {service} from '@loopback/core';

export class NftController {
  constructor(
    @repository(NfTitemRepository)
    public nfTitemRepository: NfTitemRepository,
    @service(ContractsService) private contractService: ContractsService,
  ) {}

  @get('/nft-items')
  @response(200, {
    description: 'Array of NfTitem model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(NfTitem, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(NfTitem) filter?: Filter<NfTitem>,
  ): Promise<NfTitem[]> {
    return this.nfTitemRepository.find(filter);
  }

  @get('/nft-items/{address}')
  @response(200, {
    description: 'NfTitem model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(NfTitem, {includeRelations: true}),
      },
    },
  })
  async findByAddress(
    @param.path.string('id') id: string,
    @param.path.string('address') address: string,
    @param.filter(NfTitem, {exclude: 'where'})
    filter?: FilterExcludingWhere<NfTitem>,
  ): Promise<NfTitem[]> {
    const tokenIds = await this.contractService.collection.tokenIdByAddress(
      address,
    );
    return this.nfTitemRepository.find({where: {or: tokenIds}, ...filter});
  }

  @get('/nft-items/{address}/{id}')
  @response(200, {
    description: 'NfTitem model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(NfTitem, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(NfTitem, {exclude: 'where'})
    filter?: FilterExcludingWhere<NfTitem>,
  ): Promise<NfTitem> {
    return this.nfTitemRepository.findById(id, filter);
  }
}
