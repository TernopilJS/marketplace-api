import * as schemas from './schemas';

export const getChats = {
  tags: ['chat'],
  response: {
    200: {
      type: 'array',
      items: schemas.chatWithProductAndMessage,
    },
  },
  security: [{ bearerAuth: [] }],
  description: 'Get user chats',
};

export const createMessage = {
  tags: ['chat'],
  params: {
    type: 'object',
    properties: {
      chatId: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    properties: {
      text: { type: 'string' },
    },
    required: ['text'],
  },
  response: {
    200: schemas.message,
  },
  security: [{ bearerAuth: [] }],
  description: 'Send message',
};

export const getMessages = {
  tags: ['chat'],
  params: {
    type: 'object',
    properties: {
      chatId: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'array',
      items: schemas.message,
    },
  },
  security: [{ bearerAuth: [] }],
  description: 'Get chat messages',
};
