import { v2 as cloudinary } from 'cloudinary';
import { requiredAuth } from 'auth/helpers';
import config from '../../config';
import * as schemas from './routesSchemas';
import * as handlers from './handlers';

async function routes(fastify) {
  fastify.addHook('onRequest', requiredAuth);

  cloudinary.config(config.cloudinary);
  fastify.decorate('cloudinary', cloudinary);

  fastify.post(
    '/upload/images',
    { schema: schemas.uploadImage },
    handlers.uploadImage,
  );
}

export default routes;
