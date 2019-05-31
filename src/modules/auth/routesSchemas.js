import * as userSchemas from 'users/schemas';

export const login = {
  tags: ['auth'],
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    200: userSchemas.userWithToken,
  },
  description: 'Login user',
};

export const register = {
  tags: ['auth'],
  body: {
    type: 'object',
    properties: {
      fullName: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['fullName', 'email', 'password'],
  },
  response: {
    200: userSchemas.userWithToken,
  },
  description: 'Register new user',
};
