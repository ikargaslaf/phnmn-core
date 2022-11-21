import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Attributes, AttributesRelations} from '../models';

export class AttributesRepository extends DefaultCrudRepository<
  Attributes,
  typeof Attributes.prototype.id,
  AttributesRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Attributes, dataSource);
  }
}
