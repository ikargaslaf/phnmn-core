import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class UserService {
  constructor(
    @inject('repositories.UserRepository')
    public userRepository: UserRepository,
  )
  {}

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.address,
      id: user.address,
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
}
