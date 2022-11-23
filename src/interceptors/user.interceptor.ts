import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import { ethers } from 'ethers';
@injectable({tags: {key: FindOrCreateUserInterceptor.BINDING_KEY}})
export class FindOrCreateUserInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${FindOrCreateUserInterceptor.name}`;

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  value() {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    const newUser: Partial<User> = invocationCtx.args[0]

    const isAddress: boolean = ethers.utils.isAddress(newUser.address!)
    if(!isAddress){
      throw new HttpErrors.ExpectationFailed('Expected valid eth address')
    }

    let filter: Filter<User>  = {where: {login: newUser.login, address: newUser.address}};
    const isUserExist: boolean = await this.isUserExist(filter)
    if(!isUserExist){
      await this.userRepository.create({login: newUser.login, address: newUser.address})
    }

    const result = await next();
    return result;
  }

  async isUserExist (filter: Filter<User>): Promise<boolean> {
    const foundUser: User| null = await this.userRepository.findOne(filter)

    if (foundUser) return true

    return false
  }
}

