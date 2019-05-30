import chats from './chats';
import messages from './messages';
import createMessage from './createMessage';

async function routes(fastify, options) {
  fastify.addHook('onRequest', async (req) => req.jwtVerify());

  fastify.register(chats, options);
  fastify.register(messages, options);
  fastify.register(createMessage, options);
}

export default routes;
