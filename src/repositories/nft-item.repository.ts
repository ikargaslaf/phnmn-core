import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {NFTitem, NFTitemRelations} from '../models';

export class NFTitemRepository extends DefaultCrudRepository<
  NFTitem,
  typeof NFTitem.prototype.id,
  NFTitemRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(NFTitem, dataSource);
  }
}
