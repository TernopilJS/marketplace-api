export const upload = {
  consumes: ['multipart/form-data'],
  tags: ['upload'],
  response: {
    200: { type: 'string' },
  },
  security: [{ bearerAuth: [] }],
};

export const uploadImage = {
  ...upload,
  description: 'Upload image. Returns image url. Add `image` field to form-data with image.',
};
