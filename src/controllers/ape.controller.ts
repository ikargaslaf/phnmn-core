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
  deprecated,
} from '@loopback/rest';
import {Ape, Listing} from '../models';
import {ApeRepository, ListingRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { inject, service } from '@loopback/core';
import {ContractsService} from '../services';
import {BigNumber} from 'ethers';


export class ApeController {
  constructor(
    @repository(ApeRepository)
    public apeRepository : ApeRepository,
    @repository(ListingRepository)
    private ListingRepository:ListingRepository,
    @service(ContractsService)
    private ContractsService: ContractsService
  ) {}

  @deprecated(true)
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


  @authenticate('jwt')
  @get('/apes/{address}')
  @response(200, {
    description: 'Ape model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ape, {includeRelations: true}),
      },
    },
  })
  async findByAddress(
    @param.path.string('address') address: string
  ): Promise<Ape[]> {
    console.log("I here")
    const TokenIDs: Array<BigNumber> = await this.ContractsService.collection.tokenIdByAddress(address);
    const tokenIDs: any[] = TokenIDs.map(tokenID => {return tokenID.toHexString()})
    const Listings = await this.ListingRepository.find({where: {sellerAddress: address}})
    const ids: any[] = Listings.map((Listing: Listing) => {
      return Listing.tokenId
    })
    const tokens: any[] = tokenIDs.concat(ids);
    return await this.apeRepository.find({where: {tokenId: {inq: tokens}}, include: ['sales', 'listing']});
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

  @get('/ape/{id}')
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
