import auth from './auth';
import account from './account';
import products from './products';
import users from './users';
import upload from './upload';
import chats from './chats';

async function registerModules(fastify, options) {
  fastify.register(auth, options);
  fastify.register(account, options);
  fastify.register(products, options);
  fastify.register(users, options);
  fastify.register(upload, options);
  fastify.register(chats, options);
}

export default registerModules;
