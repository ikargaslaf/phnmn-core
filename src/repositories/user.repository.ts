import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Listing} from '../models';
import {ListingRepository} from './listing.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly listings: HasManyRepositoryFactory<Listing, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ListingRepository') protected listingRepositoryGetter: Getter<ListingRepository>,
  ) {
    super(User, dataSource);
    this.listings = this.createHasManyRepositoryFactoryFor('listings', listingRepositoryGetter,);
    this.registerInclusionResolver('listings', this.listings.inclusionResolver);
  }
}
