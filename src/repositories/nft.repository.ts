import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Nft, NftRelations, Sales, Listing, ApeAttributes} from '../models';
import {SalesRepository} from './sales.repository';
import {ListingRepository} from './listing.repository';
import {ApeAttributesRepository} from './ape-attributes.repository';

export class NftRepository extends DefaultCrudRepository<
Nft,
  typeof Nft.prototype.id,
  NftRelations
> {

  public readonly sales: HasManyRepositoryFactory<Sales, typeof Nft.prototype.id>;

  public readonly listing: HasOneRepositoryFactory<Listing, typeof Nft.prototype.id>;

  public readonly apeAttributes: HasOneRepositoryFactory<ApeAttributes, typeof Nft.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SalesRepository') protected salesRepositoryGetter: Getter<SalesRepository>, @repository.getter('ListingRepository') protected listingRepositoryGetter: Getter<ListingRepository>, @repository.getter('ApeAttributesRepository') protected apeAttributesRepositoryGetter: Getter<ApeAttributesRepository>,
  ) {
    super(Nft, dataSource);
    this.apeAttributes = this.createHasOneRepositoryFactoryFor('apeAttributes', apeAttributesRepositoryGetter);
    this.registerInclusionResolver('Apettributes', this.apeAttributes.inclusionResolver);
    this.listing = this.createHasOneRepositoryFactoryFor('listing', listingRepositoryGetter);
    this.registerInclusionResolver('listing', this.listing.inclusionResolver);
    this.sales = this.createHasManyRepositoryFactoryFor('sales', salesRepositoryGetter,);
    this.registerInclusionResolver('sales', this.sales.inclusionResolver);
  }
}
