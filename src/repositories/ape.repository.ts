import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ape, ApeRelations, Sales, Listing, Attributes} from '../models';
import {SalesRepository} from './sales.repository';
import {ListingRepository} from './listing.repository';
import {AttributesRepository} from './attributes.repository';

export class ApeRepository extends DefaultCrudRepository<
  Ape,
  typeof Ape.prototype.id,
  ApeRelations
> {

  public readonly sales: HasManyRepositoryFactory<Sales, typeof Ape.prototype.id>;

  public readonly listing: HasOneRepositoryFactory<Listing, typeof Ape.prototype.id>;

  public readonly attributes: HasOneRepositoryFactory<Attributes, typeof Ape.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SalesRepository') protected salesRepositoryGetter: Getter<SalesRepository>, @repository.getter('ListingRepository') protected listingRepositoryGetter: Getter<ListingRepository>, @repository.getter('AttributesRepository') protected attributesRepositoryGetter: Getter<AttributesRepository>,
  ) {
    super(Ape, dataSource);
    this.attributes = this.createHasOneRepositoryFactoryFor('attributes', attributesRepositoryGetter);
    this.registerInclusionResolver('attributes', this.attributes.inclusionResolver);
    this.listing = this.createHasOneRepositoryFactoryFor('listing', listingRepositoryGetter);
    this.registerInclusionResolver('listing', this.listing.inclusionResolver);
    this.sales = this.createHasManyRepositoryFactoryFor('sales', salesRepositoryGetter,);
    this.registerInclusionResolver('sales', this.sales.inclusionResolver);
  }
}
