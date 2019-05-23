import auth from './auth';
import account from './account';
import products from './products';
import users from './users';
import upload from './upload';

async function declareRouters(fastify, options) {
  fastify.register(auth, options);
  fastify.register(account, options);
  fastify.register(products, options);
  fastify.register(users, options);
  fastify.register(upload, options);
}

export default declareRouters;
