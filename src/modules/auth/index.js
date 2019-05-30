import login from './login';
import register from './register';

async function routes(fastify, options) {
  fastify.register(login, options);
  fastify.register(register, options);
}

export default routes;