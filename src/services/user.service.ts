import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {UserService as LoopbackUserService} from '@loopback/authentication';
import {Credentials} from '../types';
export class UserService implements LoopbackUserService<User, Credentials>  {
  constructor(
    @inject('repositories.UserRepository')
    public userRepository: UserRepository,
  )
  {}

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.address,
      id: user.login,
      role: user.role,
    };
  }

  async checkAccess(userProfile: UserProfile, id: string) {
    const profileId = userProfile[securityId];
    const user = await this.userRepository.findOne({where: {address: profileId}});
    if (
      profileId.toLowerCase() !== id.toLowerCase() &&
      user!.role !== 'super-admin' &&
      user!.role !== 'admin'
    ) {
      throw new HttpErrors.Forbidden('Access denied');
    }
  }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid login or password.';
    const foundUser = await this.userRepository.findOne({
      where: {login: credentials.login, address: credentials.address},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    return foundUser;
  }
}
