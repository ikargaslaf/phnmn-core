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
import {NFTitem} from '../models';
import {NFTitemRepository} from '../repositories';
import {ContractsService} from '../services';
import {service} from '@loopback/core';

export class NftController {
  constructor(
    @repository(NFTitemRepository)
    public NFTitemRepository: NFTitemRepository,
    @service(ContractsService) private contractService: ContractsService,
  ) {}

  @get('/nft-items')
  @response(200, {
    description: 'Array of NfTitem model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(NFTitem, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(NFTitem) filter?: Filter<NFTitem>,
  ): Promise<NFTitem[]> {
    return this.NFTitemRepository.find(filter);
  }

  @get('/nft-items/{address}')
  @response(200, {
    description: 'NfTitem model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(NFTitem, {includeRelations: true}),
      },
    },
  })
  async findByAddress(
    @param.path.string('id') id: string,
    @param.path.string('address') address: string,
    @param.filter(NFTitem, {exclude: 'where'})
    filter?: FilterExcludingWhere<NFTitem>,
  ): Promise<NFTitem[]> {
    const tokenIds = await this.contractService.collection.tokenIdByAddress(
      address,
    );
    return this.NFTitemRepository.find({where: {or: tokenIds}, ...filter});
  }

  @get('/nft-items/{address}/{id}')
  @response(200, {
    description: 'NfTitem model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(NFTitem, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(NFTitem, {exclude: 'where'})
    filter?: FilterExcludingWhere<NFTitem>,
  ): Promise<NFTitem> {
    return this.NFTitemRepository.findById(id, filter);
  }
}
