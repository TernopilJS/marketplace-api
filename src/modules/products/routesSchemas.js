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

export const saveProduct = {
  tags: ['products'],
  params: {
    type: 'object',
    properties: {
      productId: { type: 'string' },
    },
  },
  ...bearerAuth,
  description: 'Add product to saved',
};

export const unSaveProduct = {
  tags: ['products'],
  params: {
    type: 'object',
    properties: {
      productId: { type: 'string' },
    },
  },
  ...bearerAuth,
  description: 'Remove product from saved',
};

export const getSavedProducts = {
  tags: ['products'],
  response: {
    200: {
      type: 'array',
      items: schemas.product,
    },
  },
  ...bearerAuth,
  description: 'Get saved products',
};

export const saveMultipleProducts = {
  tags: ['products'],
  body: {
    type: 'object',
    properties: {
      ids: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['ids'],
  },
  ...bearerAuth,
  description: 'Save multiple products by ids',
};

export const getProductsByIds = {
  tags: ['products'],
  querystring: {
    type: 'object',
    properties: {
      id: {
        anyOf: [
          {
            type: 'array',
            items: { type: 'string' },
          },
          { type: 'string' },
        ],
        description: 'Products ids to fetch.',
      },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'array',
      items: schemas.product,
    },
  },
  description: 'Get multiple products by ids',
};
