import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ape, ApeRelations} from '../models';

export class ApeRepository extends DefaultCrudRepository<
  Ape,
  typeof Ape.prototype.id,
  ApeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Ape, dataSource);
  }
}
