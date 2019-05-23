export const user = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    fullName: { type: 'string' },
    email: { type: 'string' },
    avatar: { type: ['string', 'null'] },
    phone: { type: ['string', 'null'] },
    createdAt: { type: 'number' },
    updatedAt: { type: ['number', 'null'] },
  },
};
