import {RequestBodyObject, ResponsesObject, SchemaObject} from '@loopback/rest';
const SignUpSchema: SchemaObject = {
  type: 'object',
  required: ['address'],
  properties: {
    address: {
      type: 'string',
      minLength: 42,
    },
  },
};


export const SignUpRequestBody: Partial<RequestBodyObject> = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: SignUpSchema},
  },
};


