import auth from './auth';
import account from './account';
import products from './products';
import users from './users';

async function declareRouters(fastify, options) {
  fastify.register(auth, options);
  fastify.register(account, options);
  fastify.register(products, options);
  fastify.register(users, options);
}

export default declareRouters;
