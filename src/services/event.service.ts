import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {ContractsService} from './contracts.service';
import {service} from '@loopback/core';
import {Events, Contracts} from '../constants';
@injectable({scope: BindingScope.TRANSIENT})
export class EventService {
  constructor(
    @service(ContractsService) private contractService: ContractsService,
  ) {
    this.contractService.startListener(Events.MINT, Contracts.COLLECTION);
  }
}
