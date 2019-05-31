import { requiredAuth } from 'auth/helpers';
import * as schemas from './routesSchemas';
import * as handlers from './handlers';

async function routes(fastify) {
  fastify.addHook('onRequest', requiredAuth);

  fastify.get(
    '/account/user',
    { schema: schemas.getAccount, description: 'some' },
    handlers.getAccount,
  );

  fastify.put(
    '/account/user',
    { schema: schemas.updateAccount },
    handlers.updateAccount,
  );
}

export default routes;
