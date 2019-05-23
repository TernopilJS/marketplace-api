async function uploadImages(fastify) {
  fastify.route({
    method: 'POST',
    url: '/upload/images',
    schema: {
      consumes: ['multipart/form-data'],
      tags: ['upload'],
      description: 'Add `image` field to form-data with image.',
      response: {
        200: { type: 'string' },
      },
    },
    onRequest: async (req) => req.jwtVerify(),
    handler: async (req, res) => {
      req.multipart(handler, done);

      // TODO: Upload multiple images
      const uploadStream = fastify.cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            res.status(422).send({ error: 'upload failed' });
            return;
          }

          res.send(result.secure_url);
        },
      );

      function handler(field, file) {
        if (field !== 'image') {
          res.status(422).send({ error: 'upload failed' });
        }

        file.pipe(uploadStream);
      }

      function done(err) {
        if (err) {
          res.status(422).send({ error: 'upload failed' });
          return;
        }

        console.log('upload completed');
      }
    },
  });
}

export default uploadImages;
