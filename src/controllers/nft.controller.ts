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
import {Nft, Listing} from '../models';
import {NftRepository, ListingRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { inject, service } from '@loopback/core';
import {ContractsService} from '../services';
import {BigNumber} from 'ethers';


export class NftController {
  constructor(
    @repository(NftRepository)
    public NftRepository : NftRepository,
    @repository(ListingRepository)
    private ListingRepository:ListingRepository,
    @service(ContractsService)
    private ContractsService: ContractsService
  ) {}

  @deprecated(true)
  @authenticate('jwt')
  @get('/nft/my-nfts')
  @response(200, {
    description: 'Nft model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Nft, {includeRelations: true}),
      },
    },
  })
  async findMyNft(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Nft[]> {
    const userId = currentUserProfile[securityId];
    console.log(userId)
    const tokenIDs = this.ContractsService.collection.tokenIdByAddress(userId);
    console.log(tokenIDs)
    const Listings = await this.ListingRepository.find({where: {sellerAddress: userId}})
    const ids = Listings.map((Listing: Listing) => {
      return Listing.nftId
    })
    console.log(ids)
    return await this.NftRepository.find({where: {or: [tokenIDs, ids]}, include: ['sales', 'listing']})
  }


  @authenticate('jwt')
  @get('/nft/{address}')
  @response(200, {
    description: 'Nft model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Nft, {includeRelations: true}),
      },
    },
  })
  async findByAddress(
    @param.path.string('address') address: string
  ): Promise<Nft[]> {
    console.log("I here")
    const TokenIDs: Array<BigNumber> = await this.ContractsService.collection.tokenIdByAddress(address);
    const tokenIDs: any[] = TokenIDs.map(tokenID => {return tokenID.toHexString()})
    const Listings = await this.ListingRepository.find({where: {sellerAddress: address}})
    const ids: any[] = Listings.map((Listing: Listing) => {
      return Listing.tokenId
    })
    const tokens: any[] = tokenIDs.concat(ids);
    return await this.NftRepository.find({where: {tokenId: {inq: tokens}}, include: ['sales', 'listing']});
  }

  @get('/nft')
  @response(200, {
    description: 'Nft model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Nft, {includeRelations: true}),
      },
    },
  })
  async find(
    @param.filter(Nft) filter?: Filter<Nft>,
  ): Promise<Nft[]> {
    return await this.NftRepository.find({include: ['sales', 'listing'], ...filter})
  }

  @get('/nft/{id}')
  @response(200, {
    description: 'Ape model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Nft, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Nft|null> {
    return await this.NftRepository.findById(id, {include: ['sales', 'listing']})
  }
}
