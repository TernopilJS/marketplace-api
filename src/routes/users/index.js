import users from './users';

async function routes(fastify, options) {
  fastify.register(users, options);
}

export default routes;
