import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {NFTitem, NFTitemRelations, Attributes} from '../models';
import {AttributesRepository} from './attributes.repository';

export class NFTitemRepository extends DefaultCrudRepository<
NFTitem,
  typeof NFTitem.prototype.id,
  NFTitemRelations
> {

  public readonly attributes: HasOneRepositoryFactory<Attributes, typeof NFTitem.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AttributesRepository') protected attributesRepositoryGetter: Getter<AttributesRepository>,
  ) {
    super(NFTitem, dataSource);
    this.attributes = this.createHasOneRepositoryFactoryFor('attributes', attributesRepositoryGetter);
    this.registerInclusionResolver('attributes', this.attributes.inclusionResolver);
  }
}
