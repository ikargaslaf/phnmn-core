import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ape, ApeRelations, Sales} from '../models';
import {SalesRepository} from './sales.repository';

export class ApeRepository extends DefaultCrudRepository<
  Ape,
  typeof Ape.prototype.id,
  ApeRelations
> {

  public readonly sales: HasManyRepositoryFactory<Sales, typeof Ape.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SalesRepository') protected salesRepositoryGetter: Getter<SalesRepository>,
  ) {
    super(Ape, dataSource);
    this.sales = this.createHasManyRepositoryFactoryFor('sales', salesRepositoryGetter,);
    this.registerInclusionResolver('sales', this.sales.inclusionResolver);
  }
}
