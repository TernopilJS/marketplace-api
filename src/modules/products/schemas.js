import * as userSchemas from 'users/schemas';

export const product = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    ownerId: { type: 'string' },
    title: { type: 'string' },
    description: { type: ['string', 'null'] },
    photos: {
      anyOf: [
        { type: 'null' },
        { type: 'array', items: { type: 'string' } },
      ],
    },
    location: { type: 'string' },
    price: { type: 'number' },
    createdAt: { type: 'number' },
    updatedAt: { type: ['number', 'null'] },
    saved: { type: 'boolean', default: false },
  },
};

export const productWithUser = {
  type: 'object',
  properties: {
    ...product.properties,
    chatId: { type: ['string', 'null'] },
    owner: userSchemas.user,
  },
};
