import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Sales, SalesRelations, Nft} from '../models';
import {NftRepository} from './nft.repository';

export class SalesRepository extends DefaultCrudRepository<
  Sales,
  typeof Sales.prototype.id,
  SalesRelations
> {

  public readonly nft: BelongsToAccessor<Nft, typeof Sales.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('NftRepository') protected nftRepositoryGetter: Getter<NftRepository>,
  ) {
    super(Sales, dataSource);
    this.nft = this.createBelongsToAccessorFor('nft', nftRepositoryGetter,);
    this.registerInclusionResolver('nft', this.nft.inclusionResolver);
  }
}
