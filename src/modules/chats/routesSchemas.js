import { bearerAuth, paginationFrom } from 'common/schemas';
import * as schemas from './schemas';

export const getChats = {
  tags: ['chat'],
  response: {
    200: {
      type: 'array',
      items: schemas.chatWithProductMessageParticipants,
    },
  },
  ...bearerAuth,
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
  ...bearerAuth,
  description: 'Send message',
};

export const getMessages = {
  tags: ['chat'],
  ...paginationFrom,
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
  ...bearerAuth,
  description: 'Get chat messages',
};
