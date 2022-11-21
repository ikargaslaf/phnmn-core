import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Sales, SalesRelations} from '../models';

export class SalesRepository extends DefaultCrudRepository<
  Sales,
  typeof Sales.prototype.id,
  SalesRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Sales, dataSource);
  }
}
