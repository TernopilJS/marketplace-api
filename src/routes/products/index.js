import create from './create';
import latest from './latest';
import productById from './productById';

async function routes(fastify, options) {
  fastify.register(create, options);
  fastify.register(latest, options);
  fastify.register(productById, options);
}

export default routes;
