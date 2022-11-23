import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {ValidationError} from './validation-error';


@injectable({tags: {key: ValidateUniqueUserInterceptor.BINDING_KEY}})
export class ValidateUniqueUserInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${ValidateUniqueUserInterceptor.name}`;

  constructor(
    @repository(User) public userRepository: UserRepository,
  ) {}

  value() {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    const newUser: Partial<User> = invocationCtx.args[0]
    let filter: Filter<User>  = {where: {address: newUser.address}};
    let errorMessage;

    if (invocationCtx.methodName === "createUser") {
      errorMessage = 'Duplicate address'
    }

    const isUserExist: boolean = await this.isUserExist(filter)

    if (isUserExist) {
      const err: ValidationError = new ValidationError(errorMessage)
      err.statusCode = 409

      throw err
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

