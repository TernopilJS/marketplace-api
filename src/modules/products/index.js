import create from './create';
import latest from './latest';
import productById from './productById';
import createChat from './createChat';

async function routes(fastify, options) {
  fastify.register(create, options);
  fastify.register(latest, options);
  fastify.register(productById, options);
  fastify.register(createChat, options);
}

export default routes;
