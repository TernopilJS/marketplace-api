import { product } from 'products/schemas';
import { user } from 'users/schemas';
import { messageActions } from './constants';

export const message = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    chatId: { type: 'string' },
    ownerId: { type: 'string' },

    text: { type: 'string' },
    read: { type: 'boolean' },

    createdAt: { type: 'number' },
    updatedAt: { type: ['number', 'null'] },
  },
};

export const messageWithActionType = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: Object.values(messageActions),
    },
    message,
  },
};

export const chat = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    productId: { type: 'string' },
    ownerId: { type: 'string' },

    createdAt: { type: 'number' },
    updatedAt: { type: ['number', 'null'] },
  },
};

export const chatWithLastMessage = {
  type: 'object',
  properties: {
    ...chat.properties,
    lastMessage: {
      anyOf: [{ type: 'null' }, message],
    },
  },
};

export const chatWithProductMessageParticipants = {
  type: 'object',
  properties: {
    ...chatWithLastMessage.properties,
    product,
    participants: {
      type: 'array',
      items: user,
    },
  },
};
