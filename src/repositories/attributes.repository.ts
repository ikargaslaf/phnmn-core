import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Attributes, AttributesRelations, NfTitem} from '../models';
import {NfTitemRepository} from './nf-titem.repository';

export class AttributesRepository extends DefaultCrudRepository<
  Attributes,
  typeof Attributes.prototype.id,
  AttributesRelations
> {

  public readonly nfTitem: BelongsToAccessor<NfTitem, typeof Attributes.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('NfTitemRepository') protected nfTitemRepositoryGetter: Getter<NfTitemRepository>,
  ) {
    super(Attributes, dataSource);
    this.nfTitem = this.createBelongsToAccessorFor('nfTitem', nfTitemRepositoryGetter,);
    this.registerInclusionResolver('nfTitem', this.nfTitem.inclusionResolver);
  }
}
