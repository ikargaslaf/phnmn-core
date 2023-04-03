import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ApeAttributes, ApeAttributesRelations} from '../models';

export class ApeAttributesRepository extends DefaultCrudRepository<
  ApeAttributes,
  typeof ApeAttributes.prototype.id,
  ApeAttributes
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ApeAttributes, dataSource);
  }
}
