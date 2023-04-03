import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Listing, ListingRelations, Nft} from '../models';
import {NftRepository} from './nft.repository';

export class ListingRepository extends DefaultCrudRepository<
  Listing,
  typeof Listing.prototype.id,
  ListingRelations
> {

  public readonly nft: BelongsToAccessor<Nft, typeof Listing.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('NftRepository') protected nftRepositoryGetter: Getter<NftRepository>,
  ) {
    super(Listing, dataSource);
    this.nft = this.createBelongsToAccessorFor('nft', nftRepositoryGetter,);
    this.registerInclusionResolver('nft', this.nft.inclusionResolver);
  }
}
