import account from './account';

async function routes(fastify, options) {
  fastify.register(account, options);
}

export default routes;