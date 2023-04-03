// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {registerAuthenticationStrategy} from '@loopback/authentication';
import {
  Application,
  Binding,
  Component,
  CoreBindings,
  createBindingFromClass,
  inject,
} from '@loopback/core';
import {JWTAuthenticationStrategy} from './strategy/jwt-strategy';
import {
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './keys';
import {
  UserRepository,
} from './repositories';
import { UserService} from './services';
import {JWTService} from './services/jwt.service';
import {SecuritySpecEnhancer} from './spec/security.spec.enhancer';

export class JWTAuthenticationComponent implements Component {
  bindings: Binding[] = [
    // Token bindings
    Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService),

    // User bindings
    Binding.bind(UserServiceBindings.USER_SERVICE).toClass(UserService),
    Binding.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository),
    createBindingFromClass(SecuritySpecEnhancer),
  ];
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
    registerAuthenticationStrategy(app, JWTAuthenticationStrategy);
  }
}
