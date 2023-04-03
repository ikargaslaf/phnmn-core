import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {ContractsService} from './contracts.service';
import {service} from '@loopback/core';
import {Events, Contracts} from '../constants';
@injectable({scope: BindingScope.TRANSIENT})
export class EventService {
  constructor(
    @service(ContractsService) private contractService: ContractsService,
  ) {
    // this.contractService.startListener(Events.MINT, Contracts.COLLECTION);
    this.contractService.startListener(Events.INIT, Contracts.COLLECTION);
    this.contractService.startListener(Events.ROUTER_LISTED, Contracts.ROUTER);
    this.contractService.startListener(Events.ROUTER_UPDATED, Contracts.ROUTER);
    this.contractService.startListener(Events.ROUTER_CANCELED, Contracts.ROUTER);
    this.contractService.startListener(Events.ROUTER_SOLD, Contracts.ROUTER);
    this.contractService.startListener(Events.AUCTION_LISTED, Contracts.AUCTION);
    this.contractService.startListener(Events.AUCTION_BIDDED, Contracts.AUCTION);
    this.contractService.startListener(Events.AUCTION_CLAIM_ITEM, Contracts.AUCTION);
    this.contractService.startListener(Events.AUCTION_CLAIM_PAYMENT, Contracts.AUCTION);
  }
}
