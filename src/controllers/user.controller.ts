import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import { intercept, inject } from '@loopback/core';
import {FindOrCreateUserInterceptor} from '../interceptors';
import { LoginRequestBody } from '../spec/user-controller.specs';
import { TokenObject, TokensResponseBody } from '../spec/user-controller.specs';
import { JWTService, UserService, } from '../services';
import {authenticate, TokenService} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserServiceBindings
} from '../keys';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE) public userService: UserService,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: string,
  ) {}

  @intercept(FindOrCreateUserInterceptor.BINDING_KEY)
  @post('/users/login')
  @response(200, TokensResponseBody)
  async login(
    @requestBody(LoginRequestBody)
    user: Omit<User, 'id'>,
  ): Promise<TokenObject> {
    const foundUser = await this.userRepository.findOne({where: {login: user.login, address: user.address}});
    const userProfile = this.userService.convertToUserProfile(foundUser as User);
    const accessToken = await this.jwtService.generateToken(userProfile);
    const Token: TokenObject = {
      accessToken: accessToken,
      accessExpiresIn: +this.jwtExpiresIn
    }
    return Token;
  }

  @authenticate('jwt')
  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async findMe(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<User| null> {
    const userId = currentUserProfile[securityId];
    return this.userRepository.findOne({where: {address: userId}});
  }

  @authenticate('jwt')
  @patch('/users/me/change-info')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    const userId = currentUserProfile[securityId];
    const me = await this.userRepository.findOne({where: {address: userId}});
    await this.userRepository.updateById(me!.id, user);
  }
}
