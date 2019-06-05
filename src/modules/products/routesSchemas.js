import * as chatSchemas from 'chats/schemas';
import { bearerAuth } from 'common/schemas';
import * as schemas from './schemas';

export const getLatestProducts = {
  tags: ['products'],
  response: {
    200: {
      type: 'array',
      items: schemas.product,
    },
  },
  description: 'Get latest products',
};

export const getProductById = {
  params: {
    type: 'object',
    properties: {
      productId: { type: 'string' },
    },
  },
  tags: ['products'],
  response: {
    200: schemas.productWithUser,
  },
  description: 'Get product by productId',
};

export const createProduct = {
  tags: ['products'],
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      photos: {
        type: 'array',
        items: { type: 'string' },
      },
      location: { type: 'string' },
      price: { type: 'number' },
    },
    required: ['title', 'location', 'price'],
  },
  response: {
    200: schemas.product,
  },
  ...bearerAuth,
  description: 'Create new product',
};

export const createChat = {
  tags: ['chat'],
  params: {
    type: 'object',
    properties: {
      productId: { type: 'string' },
    },
  },
  response: {
    200: chatSchemas.chat,
  },
  ...bearerAuth,
  description: 'Create chat related to the product',
};
