/* eslint-disable @typescript-eslint/prefer-for-of */
import {injectable, /* inject, */ BindingScope, service} from '@loopback/core';

import {BigNumber, Contract, ethers} from 'ethers';
import {LogDescription} from 'ethers/lib/utils';
import {ProviderService} from './provider.service';
import {HttpErrors} from '@loopback/rest';
import {repository} from '@loopback/repository';

import {ApeRepository} from '../repositories';

import {Events, Contracts, RARITY} from '../constants';

import Collection from '../contracts/abi/Collection.json';
import Router from '../contracts/abi/Router.json';
import Auction from '../contracts/abi/Auction.json'

@injectable({scope: BindingScope.TRANSIENT})
export class ContractsService {
  collection: Contract;
  router: Contract;
  auction: Contract
  constructor(
    @service(ProviderService)
    private providerService: ProviderService,
    @repository(ApeRepository)
    private ApeRepository: ApeRepository,
  ) {
    this.createContractInstanses();
  }

  async createContractInstanses() {
    this.collection = new ethers.Contract(
      process.env.COLLECTION as string,
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
      const event = [args[args.length - 1]];
      await this.eventActions(eventName, event);
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
        break;
      case Events.ROUTER_UPDATED:
        break;
      case Events.ROUTER_SOLD:
        break;
      case Events.ROUTER_CANCELED:
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
      const tokenId = events[i].args.tokenId;
      const rarity = events[i].args.rarity;
      const meta = await this.ApeRepository.create({
        tokenId: tokenId,
        rarity: rarity,
        contractAddress: process.env.COLLECTION!,
        name: `Ape#${tokenId}`,
        description: RARITY[rarity],
        image: `./public/assets/${RARITY[rarity]}/${RARITY[rarity]}_BASE.png`,
        onSale: false,
        onAuction: false
      });
    }
  }

  async processItemListed(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId;
      const nftAddress = events[i].args.nftAddress;
      const nftItem = await this.ApeRepository.findOne(
      {
        where:
        {
          tokenId: tokenId,
          contractAddress: nftAddress
        }
      }
      );

      if (nftItem!=null){
        await this.ApeRepository.listing(nftItem!.id).create({
          sellerAddress: events[i].args.seller,
          tokenId: tokenId,
          price: events[i].args.price.toString(),
        })
      }
    }
  }

  async processItemListingUpdated(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId;
      const nftAddress = events[i].args.nftAddress;
      const nftItem = await this.ApeRepository.findOne(
      {
        where:
        {
          tokenId: tokenId,
          contractAddress: nftAddress
        }
      }
      );

      if (nftItem!=null){
        await this.ApeRepository.listing(nftItem!.id).patch({price: events[i].args.price.toString()})
      }
    }
  }

  async processItemListingCanceled(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId;
      const nftAddress = events[i].args.nftAddress;
      const nftItem = await this.ApeRepository.findOne(
      {
        where:
        {
          tokenId: tokenId,
          contractAddress: nftAddress
        }
      }
      );

      if (nftItem!=null){
        await this.ApeRepository.listing(nftItem!.id).delete()
      }
    }
  }

  async processItemSold(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      for (let i = 0; i < events.length; ++i) {
        const tokenId = events[i].args.tokenId;
        const nftAddress = events[i].args.nftAddress;
        const nftItem = await this.ApeRepository.findOne(
        {
          where:
          {
            tokenId: tokenId,
            contractAddress: nftAddress
          }
        }
        );

        if (nftItem!=null){
          await this.ApeRepository.sales(nftItem!.id).create({
            price: events[i].args.price.toString(),
            timestamp: new Date().getTime().toString()
          })
          await this.ApeRepository.listing(nftItem!.id).delete();
        }
      }
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
