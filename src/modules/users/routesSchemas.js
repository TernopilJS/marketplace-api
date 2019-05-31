import * as productSchemas from 'products/schemas';

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
