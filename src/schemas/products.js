import _ from 'lodash/fp';
import { user } from './users';

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
  },
};

export const productWithUser = {
  type: 'object',
  properties: {
    ..._.omit('ownerId')(product.properties),
    chatId: { type: ['string', 'null'] },
    owner: user,
  },
};
