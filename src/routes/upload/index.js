import { v2 as cloudinary } from 'cloudinary';
import config from '../../config';
import images from './images';

async function routes(fastify, options) {
  cloudinary.config(config.cloudinary);
  fastify.decorate('cloudinary', cloudinary);

  fastify.register(images, options);
}

export default routes;
