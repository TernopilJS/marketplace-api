export const user = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    fullName: { type: 'string' },
    location: { type: ['string', 'null'] },
    avatar: { type: ['string', 'null'] },
    phone: { type: ['string', 'null'] },
    createdAt: { type: 'number' },
    updatedAt: { type: ['number', 'null'] },
  },
};

export const userWithToken = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    user,
  },
};

export const userAccount = {
  type: 'object',
  properties: {
    ...user.properties,
    email: { type: 'string' },
  },
};
