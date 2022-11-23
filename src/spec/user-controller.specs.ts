import {RequestBodyObject, ResponsesObject, SchemaObject} from '@loopback/rest';
const LoginSchema: SchemaObject = {
  type: 'object',
  required: ['login', 'address'],
  properties: {
    login: {
      type: 'string',
      default: 'default_username',
      minLength: 8,
    },
    address: {
      type: 'string',
      minLength: 42,
    },
  },
};

export const LoginRequestBody: Partial<RequestBodyObject> = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: LoginSchema},
  },
};

export type TokenObject = {
  accessToken: string;
  accessExpiresIn?: number;
};

const tokensProperties: SchemaObject['properties'] = {
  accessToken: {type: 'string'},
  accessExpiresIn: {type: 'number'},
};

const TokensResponseSchema: SchemaObject = {
  type: 'object',
  properties: tokensProperties,
};

export const TokensResponseBody: ResponsesObject = {
  '200': {
    description: 'Token',
    content: {
      'application/json': {
        schema: TokensResponseSchema,
      },
    },
  },
};
