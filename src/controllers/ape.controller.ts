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
import {Ape, Listing} from '../models';
import {ApeRepository, ListingRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { inject, service } from '@loopback/core';
import {ContractsService} from '../services';

export class ApeController {
  constructor(
    @repository(ApeRepository)
    public apeRepository : ApeRepository,
    @repository(ListingRepository)
    private ListingRepository:ListingRepository,
    @service(ContractsService)
    private ContractsService: ContractsService
  ) {}

  @authenticate('jwt')
  @get('/apes/my-apes')
  @response(200, {
    description: 'Ape model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ape, {includeRelations: true}),
      },
    },
  })
  async findMyApes(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Ape[]> {
    const userId = currentUserProfile[securityId];
    console.log(userId)
    const tokenIDs = this.ContractsService.collection.tokenIdByAddress(userId);
    console.log(tokenIDs)
    const Listings = await this.ListingRepository.find({where: {sellerAddress: userId}})
    const ids = Listings.map((Listing: Listing) => {
      return Listing.apeId
    })
    console.log(ids)
    return await this.apeRepository.find({where: {or: [tokenIDs, ids]}, include: ['sales', 'listing']})
  }

  @get('/apes')
  @response(200, {
    description: 'Ape model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ape, {includeRelations: true}),
      },
    },
  })
  async find(
    @param.filter(Ape) filter?: Filter<Ape>,
  ): Promise<Ape[]> {
    return await this.apeRepository.find({include: ['sales', 'listing'], ...filter})
  }

  @authenticate('jwt')
  @get('/apes/{id}')
  @response(200, {
    description: 'Ape model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ape, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Ape|null> {
    return await this.apeRepository.findById(id, {include: ['sales', 'listing']})
  }
}
