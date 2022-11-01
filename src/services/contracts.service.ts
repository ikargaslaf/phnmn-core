/* eslint-disable @typescript-eslint/prefer-for-of */
import {injectable, /* inject, */ BindingScope, service} from '@loopback/core';

import {BigNumber, Contract, ethers} from 'ethers';
import {LogDescription} from 'ethers/lib/utils';
import {ProviderService} from './provider.service';
import {HttpErrors} from '@loopback/rest';
import {repository} from '@loopback/repository';

import {NfTitem, Attributes} from '../models';
import {NfTitemRepository, AttributesRepository} from '../repositories';

import {Events, Contracts, RARITY} from '../constants';

import Collection from '../contracts/abi/Collection.json';
import Router from '../contracts/abi/Router.json';

@injectable({scope: BindingScope.TRANSIENT})
export class ContractsService {
  collection: Contract;
  router: Contract;
  constructor(
    @service(ProviderService)
    private providerService: ProviderService,
    @repository(NfTitemRepository)
    private nftRepository: NfTitemRepository,
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
      // await this.updateEventBlock(event[event.length - 1].blockNumber);
    });
  }

  async eventActions(eventName: string, event: any) {
    switch (eventName) {
      case Events.MINT:
        await this.processingItemsMinted(event);
        break;
    }
  }

  async processingItemsMinted(events: any[]) {
    for (let i = 0; i < events.length; ++i) {
      const tokenId = events[i].args.tokenId;
      const rarity = events[i].args.tokenId;
      const meta = await this.nftRepository.create({
        tokenId: tokenId,
        rarity: rarity,
        name: `Ape#${tokenId}`,
        description: RARITY[rarity],
        image: `./public/assets/${RARITY[rarity]}/${RARITY[rarity]}_BASE.png`,
      });
      await this.nftRepository.attributes(meta.id!).create({
        mask: '',
        hat: '',
        glasses: '',
        jewerly: '',
        clothes: '',
        tatoos: '',
      });
    }
  }
}
