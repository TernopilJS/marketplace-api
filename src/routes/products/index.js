import products from './products';

async function routes(fastify, options) {
  fastify.register(products, options);
}

export default routes;
