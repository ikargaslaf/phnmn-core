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
@injectable({tags: {key: ValidateUniqueUserInterceptor.BINDING_KEY}})
export class ValidateUniqueUserInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${ValidateUniqueUserInterceptor.name}`;

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
    let filter: Filter<User>  = {where: {login: newUser.login}};

    const isUserExist: boolean = await this.isUserExist(filter)

    if (isUserExist) {
      throw new HttpErrors.Conflict('User with this login already exists')
    }

    const isAddress: boolean = ethers.utils.isAddress(newUser.address!)

    if(!isAddress){
      throw new HttpErrors.ExpectationFailed('Expected valid eth address')
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

