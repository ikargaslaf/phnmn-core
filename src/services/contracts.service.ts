/* eslint-disable @typescript-eslint/prefer-for-of */
import {injectable, /* inject, */ BindingScope, service, DefaultConfigurationResolver} from '@loopback/core';

import {BigNumber, Contract, ethers} from 'ethers';
import {LogDescription} from 'ethers/lib/utils';
import {ProviderService} from './provider.service';
import {HttpErrors} from '@loopback/rest';
import {repository} from '@loopback/repository';

import {NftRepository, ServiceRepository} from '../repositories';

import {Events, Contracts, RARITY} from '../constants';

import Collection from '../contracts/abi/Collection.json';
import Router from '../contracts/abi/Router.json';
import Auction from '../contracts/abi/Auction.json'
import { generateAttributes, generateImage} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class ContractsService {
  collection: Contract;
  router: Contract;
  auction: Contract
  constructor(
    @service(ProviderService)
    private providerService: ProviderService,
    @repository(NftRepository)
    private NftRepository: NftRepository,
    @repository(ServiceRepository)
    private ServiceRepository: ServiceRepository
  ) {
    this.createContractInstanses();
  }

  async createContractInstanses() {
    this.collection = new ethers.Contract(
      process.env.APE_COLLECTION as string,
      Collection.abi,
      this.providerService.provider,
    );

    this.router = new ethers.Contract(
      process.env.ROUTER as string,
      Router.abi,
      this.providerService.provider,
    );

    this.auction = new ethers.Contract(
      process.env.AUCTION as string,
      Auction.abi,
      this.providerService.provider,
    );
  }

  getContractByString(contractName: string): {
    eventOwnedContract: Contract;
    contractName: Contracts;
  } {
    switch (contractName) {
      case Contracts.COLLECTION:
        return {
          eventOwnedContract: this.collection,
          contractName: Contracts.COLLECTION,
        };
      case Contracts.ROUTER:
        return {
          eventOwnedContract: this.router,
          contractName: Contracts.ROUTER,
        };
      case Contracts.AUCTION:
        return {
          eventOwnedContract: this.auction,
          contractName: Contracts.AUCTION,
        };
      default:
        throw new HttpErrors.NotFound('Contract not found');
    }
  }

  getEventsFromBlock = async (
    blockNumber: number,
    contract: Contract,
    eventName?: Events,
    userAddress?: string,
  ) => {
    const topics = [];
    if (!(eventName === undefined)) {
      topics.push(contract.interface.getEventTopic(eventName!));
    }
    if (!(userAddress === undefined)) {
      topics.push(ethers.utils.hexZeroPad(userAddress, 32));
    }
    const filter = {
      address: contract.address,
      fromBlock: blockNumber,
      toBlock: 'latest',
      topics: topics,
    };

    const logs = await this.providerService.provider!.getLogs(filter);
    const parsedLogs = logs.map(log => {
      const event: LogDescription & {blockNumber?: number} =
        contract.interface.parseLog(log);
      event.blockNumber = log.blockNumber;
      return event;
    });

    return parsedLogs;
  };

  async startListener(eventName: string, contract: string) {
    const {eventOwnedContract, contractName} =
      this.getContractByString(contract);
    eventOwnedContract.on(eventName, async (...args: any) => {
      const event = args[args.length - 1];
      await this.eventActions(eventName, [event]);
      await this.ServiceRepository.updateAll({blockNumber: event.blockNumber});
    });
  }

  async eventActions(eventName: string, event: any) {
    switch (eventName) {
      case Events.INIT:
        await this.processingTokenInited(event);
        break;
      case Events.MINT:
        break;
      case Events.ROUTER_LISTED:
        await this.processItemListed(event);
        break;
      case Events.ROUTER_UPDATED:
        await this.processItemListingUpdated(event);
        break;
      case Events.ROUTER_SOLD:
        await this.processItemSold(event);
        break;
      case Events.ROUTER_CANCELED:
        await this.processItemListingCanceled(event);
        break;
      case Events.AUCTION_LISTED:
        break;
      case Events.AUCTION_BIDDED:
        break;
      case Events.AUCTION_CLAIM_ITEM:
        break;
      case Events.AUCTION_CLAIM_PAYMENT:
        break;
      }
  }

  async processingTokenInited(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId.toHexString();
      const rarity = events[i].args.rarity;
      const checkIfExist = await this.NftRepository.findOne({where: {contractAddress: process.env.COLLECTION!, tokenId: tokenId}});
      if (checkIfExist==null){
        const attributes = generateAttributes(tokenId, rarity);
        await generateImage(tokenId, rarity, attributes)
        const meta = await this.NftRepository.create({
          tokenId: tokenId,
          contractAddress: process.env.COLLECTION!,
          name: `Ape#${tokenId}`,
          description: RARITY[rarity],
          image: `/apes/${tokenId}.png`,
          onSale: false,
          onAuction: false
        });
        await this.NftRepository.apeAttributes(meta.id).create({rarity: rarity,...attributes});
      }
    }
  }

  async processItemListed(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId.toHexString();
      const nftAddress = events[i].args.nftAddress;
      const nftItem = await this.NftRepository.findOne(
      {
        where:
        {
          tokenId: tokenId,
          contractAddress: nftAddress
        }
      }
      );

      if (nftItem!=null && !nftItem.onSale){
        await this.NftRepository.listing(nftItem!.id).create({
          sellerAddress: events[i].args.seller,
          tokenId: tokenId,
          price: events[i].args.price.toString(),
        })
        await this.NftRepository.updateById(nftItem!.id, {onSale:true})
      }
    }
  }

  async processItemListingUpdated(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId.toHexString();
      const nftAddress = events[i].args.nftAddress;
      const nftItem = await this.NftRepository.findOne(
      {
        where:
        {
          tokenId: tokenId,
          contractAddress: nftAddress
        }
      }
      );

      if (nftItem!=null){
        await this.NftRepository.listing(nftItem!.id).patch({price: events[i].args.newPrice.toString()})
      }
    }
  }

  async processItemListingCanceled(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId.toHexString();
      const nftAddress = events[i].args.nftAddress;
      const nftItem = await this.NftRepository.findOne(
      {
        where:
        {
          tokenId: tokenId,
          contractAddress: nftAddress
        }
      }
      );

      if (nftItem!=null){
        await this.NftRepository.listing(nftItem!.id).delete()
        await this.NftRepository.updateById(nftItem!.id, {onSale:false})
      }
    }
  }

  async processItemSold(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId.toHexString();
      const nftAddress = events[i].args.nftAddress;
      const nftItem = await this.NftRepository.findOne(
      {
        where:
        {
          tokenId: tokenId,
          contractAddress: nftAddress
        }
      }
      );

      await this.NftRepository.sales(nftItem!.id).create({
        price: events[i].args.price.toString(),
        timestamp: new Date().getTime().toString()
      })
      await this.NftRepository.listing(nftItem!.id).delete();
      await this.NftRepository.updateById(nftItem!.id, {onSale:false})
    }
  }

  async processAuctionListing(events: any[]) {
    for (let i = 0; i < events.length; ++i) {}
  }

  async processAuctionBid(events: any[]) {
    for (let i = 0; i < events.length; ++i) {}
  }

  async processAuictionClaimItem(events: any[]) {
    for (let i = 0; i < events.length; ++i) {}
  }

  async processAuictionClaimPayment(events: any[]) {
    for (let i = 0; i < events.length; ++i) {}
  }
}
