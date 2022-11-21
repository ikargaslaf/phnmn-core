import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Listing, ListingRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class ListingRepository extends DefaultCrudRepository<
  Listing,
  typeof Listing.prototype.id,
  ListingRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Listing.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Listing, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
