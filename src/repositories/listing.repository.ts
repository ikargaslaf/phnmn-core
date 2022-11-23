import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Listing, ListingRelations, Ape} from '../models';
import {ApeRepository} from './ape.repository';

export class ListingRepository extends DefaultCrudRepository<
  Listing,
  typeof Listing.prototype.id,
  ListingRelations
> {

  public readonly ape: BelongsToAccessor<Ape, typeof Listing.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ApeRepository') protected apeRepositoryGetter: Getter<ApeRepository>,
  ) {
    super(Listing, dataSource);
    this.ape = this.createBelongsToAccessorFor('ape', apeRepositoryGetter,);
    this.registerInclusionResolver('ape', this.ape.inclusionResolver);
  }
}
