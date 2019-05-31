import * as userSchemas from 'users/schemas';

export const getAccount = {
  tags: ['user'],
  response: {
    200: userSchemas.user,
  },
  security: [{ bearerAuth: [] }],
  description: 'Get user account',
};

export const updateAccount = {
  tags: ['user'],
  body: {
    type: 'object',
    properties: {
      fullName: { type: 'string' },
      avatar: { type: ['string', 'null'] },
      phone: { type: ['string', 'null'] },
    },
    required: ['avatar', 'fullName', 'phone'],
  },
  response: {
    200: userSchemas.user,
  },
  security: [{ bearerAuth: [] }],
  description: 'Update user account',
};
