export const paginationOffset = {
  querystring: {
    type: 'object',
    properties: {
      offset: { type: 'number', description: 'Offset', default: 0 },
      limit: { type: 'number', default: 20 },
    },
  },
};

export const paginationFrom = {
  querystring: {
    type: 'object',
    properties: {
      from: {
        type: 'number',
        description: 'Item `id` from which will fetch next items',
      },
      limit: { type: 'number', default: 20 },
    },
  },
};

export const bearerAuth = {
  security: [{ bearerAuth: [] }],
};
