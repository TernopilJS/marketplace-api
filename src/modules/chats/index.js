import { requiredAuth } from 'auth/helpers';
import * as schemas from './routesSchemas';
import * as handlers from './handlers';

async function routes(fastify) {
  fastify.addHook('onRequest', requiredAuth);

  fastify.get('/chats', { schema: schemas.getChats }, handlers.getChats);
  fastify.post(
    '/chats/:chatId/messages',
    { schema: schemas.createMessage },
    handlers.createMessage,
  );
  fastify.get(
    '/chats/:chatId/messages',
    { schema: schemas.getMessages },
    handlers.getMessages,
  );
}

export default routes;
