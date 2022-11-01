import {
  inject,
  service,
  Application,
  CoreBindings,
  lifeCycleObserver, // The decorator
  LifeCycleObserver, // The interface
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {NfTitemRepository, ServiceRepository} from '../repositories';
import {ContractsService, ProviderService} from '../services';
/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class BootObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @repository(ServiceRepository) private serviceRepository: ServiceRepository,
    @repository(NfTitemRepository) private nftRepository: NfTitemRepository,
    @service(ContractsService) private contractsService: ContractsService,
    @service(ProviderService) private providerService: ProviderService,
  ) {}

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    const serviceModel = await this.serviceRepository.find();
    const nftModels = await this.serviceRepository.find();
    const attributeModels = await this.serviceRepository.find();
    if (
      serviceModel.length == 0 &&
      nftModels.length == 0 &&
      attributeModels.length == 0
    ) {
      await this.serviceRepository.create({
        blockNumber: 0,
      });
    }
  }
  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    const serviceModel = await this.serviceRepository.find();
    const blockNumber = serviceModel[0].blockNumber;
    const events = await this.contractsService.getEventsFromBlock(
      blockNumber,
      this.contractsService.collection,
    );
    for (let i = 0; i < events.length; ++i) {
      await this.contractsService.eventActions(events[i].name, [events[i]]);
    }
    const latestBlock = await this.providerService.provider?.getBlockNumber();
    await this.serviceRepository.updateAll({blockNumber: latestBlock});
  }

  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
