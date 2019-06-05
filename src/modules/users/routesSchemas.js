import * as productSchemas from 'products/schemas';
import * as schemas from './schemas';

export const getUserProducts = {
  tags: ['products'],
  params: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: productSchemas.product,
        },
        count: { type: 'number' },
      },
    },
  },
  description: 'Get user products',
};

export const getUser = {
  tags: ['user'],
  params: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
    },
  },
  response: {
    200: schemas.user,
  },
  description: 'Get user by id',
};
