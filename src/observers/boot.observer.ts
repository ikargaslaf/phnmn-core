import {
  inject,
  service,
  Application,
  CoreBindings,
  lifeCycleObserver, // The decorator
  LifeCycleObserver, // The interface
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ServiceRepository, CollectionRepository, NftRepository} from '../repositories';
import {ContractsService, ProviderService} from '../services';
import { Collections } from '../constants';
import { getEnv } from '../utils';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class BootObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @repository(ServiceRepository) private serviceRepository: ServiceRepository,
    @repository(CollectionRepository) private collectionRepository: CollectionRepository,
    @repository(NftRepository) private nftRepository: NftRepository,
    @service(ContractsService) private contractsService: ContractsService,
    @service(ProviderService) private providerService: ProviderService,
  ) {}

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    const serviceModel = await this.serviceRepository.find();
    const nftModels = await this.nftRepository.find();
    const collection = await this.collectionRepository.find();
    if (
      serviceModel.length == 0 &&
      nftModels.length == 0 &&
      collection.length == 0
    ) {
      await this.serviceRepository.create({
        blockNumber: 0,
      });

      const collections = Object.values(Collections);
      const addresses = collections.map(collection => {
        const collectionAddress = getEnv(collection)
        if (collectionAddress!=""){
          return collection
        }
      })

      for(let i = 0; i < addresses.length; i++){
        await this.collectionRepository.create({
          name: "Default collection name",
          description: "Default collection description",
          image: "/assets/collections/default_collection_logo.jpg",
          address: addresses[i],
          totalValue: '0',
          floorPrice: '0',
          listedProsent: '0',
          createdAt: Date(),
          updatedAt: Date(),
        })
      }
    }
  }
  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    const serviceModel = await this.serviceRepository.find();
    const blockNumber = serviceModel[0].blockNumber;

    const eventsCollection = await this.contractsService.getEventsFromBlock(
      blockNumber,
      this.contractsService.collection,
    );

    for (let i = 0; i < eventsCollection.length; ++i) {
      await this.contractsService.eventActions(eventsCollection[i].name, [eventsCollection[i]]);
    }

    const eventsRouter = await this.contractsService.getEventsFromBlock(
      blockNumber,
      this.contractsService.router,
    );

    for (let i = 0; i < eventsRouter.length; ++i) {
      await this.contractsService.eventActions(eventsRouter[i].name, [eventsRouter[i]]);
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
