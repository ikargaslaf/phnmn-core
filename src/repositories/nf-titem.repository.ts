import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {NfTitem, NfTitemRelations, Attributes} from '../models';
import {AttributesRepository} from './attributes.repository';

export class NfTitemRepository extends DefaultCrudRepository<
  NfTitem,
  typeof NfTitem.prototype.id,
  NfTitemRelations
> {

  public readonly attributes: HasOneRepositoryFactory<Attributes, typeof NfTitem.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AttributesRepository') protected attributesRepositoryGetter: Getter<AttributesRepository>,
  ) {
    super(NfTitem, dataSource);
    this.attributes = this.createHasOneRepositoryFactoryFor('attributes', attributesRepositoryGetter);
    this.registerInclusionResolver('attributes', this.attributes.inclusionResolver);
  }
}
