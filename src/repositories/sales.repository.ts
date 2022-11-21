import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Sales, SalesRelations, Ape} from '../models';
import {ApeRepository} from './ape.repository';

export class SalesRepository extends DefaultCrudRepository<
  Sales,
  typeof Sales.prototype.id,
  SalesRelations
> {

  public readonly ape: BelongsToAccessor<Ape, typeof Sales.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ApeRepository') protected apeRepositoryGetter: Getter<ApeRepository>,
  ) {
    super(Sales, dataSource);
    this.ape = this.createBelongsToAccessorFor('ape', apeRepositoryGetter,);
    this.registerInclusionResolver('ape', this.ape.inclusionResolver);
  }
}
