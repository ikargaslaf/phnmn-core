import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Auction, AuctionRelations} from '../models';

export class AuctionRepository extends DefaultCrudRepository<
  Auction,
  typeof Auction.prototype.id,
  AuctionRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Auction, dataSource);
  }
}
