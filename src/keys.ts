import {TokenService, /*UserService*/} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
// import {User} from './models';
import { UserService } from './services';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = process.env.TOKEN_SECRET_VALUE as string;
  export const TOKEN_EXPIRES_IN_VALUE = process.env.TOKEN_EXPIRES_IN_VALUE as string; 
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService>(
    'services.user.service',
  );
  export const USER_REPOSITORY = 'repositories.UserRepository';
}
