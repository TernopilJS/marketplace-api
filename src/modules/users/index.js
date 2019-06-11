import { optionalAuth } from '../auth/helpers';
import * as schemas from './routesSchemas';
import * as handlers from './handlers';

async function routes(fastify) {
  fastify.get(
    '/users/:userId/products',
    { schema: schemas.getUserProducts, onRequest: optionalAuth },
    handlers.getUserProducts,
  );

  fastify.get(
    '/users/:userId',
    { schema: schemas.getUser },
    handlers.getUser,
  );
}

export default routes;
