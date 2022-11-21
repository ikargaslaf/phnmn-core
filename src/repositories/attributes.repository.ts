import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Attributes, AttributesRelations, NFTitem} from '../models';
import {NFTitemRepository} from './nft-item.repository';

export class AttributesRepository extends DefaultCrudRepository<
  Attributes,
  typeof Attributes.prototype.id,
  AttributesRelations
> {

  public readonly nfTitem: BelongsToAccessor<NFTitem, typeof Attributes.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('NfTitemRepository') protected nfTitemRepositoryGetter: Getter<NFTitemRepository>,
  ) {
    super(Attributes, dataSource);
    this.nfTitem = this.createBelongsToAccessorFor('nfTitem', nfTitemRepositoryGetter,);
    this.registerInclusionResolver('nfTitem', this.nfTitem.inclusionResolver);
  }
}
