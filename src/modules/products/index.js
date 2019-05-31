import { optionalAuth, requiredAuth } from 'auth/helpers';
import * as handlers from './handlers';
import * as schemas from './routesSchemas';

async function routes(fastify) {
  fastify.get(
    '/products/latest',
    { schema: schemas.getLatestProducts },
    handlers.getLatestProducts,
  );

  fastify.post(
    '/products',
    {
      schema: schemas.createProduct,
      onRequest: requiredAuth,
    },
    handlers.createProduct,
  );

  fastify.post(
    '/products/:productId/createChat',
    {
      schema: schemas.createChat,
      onRequest: requiredAuth,
    },
    handlers.createChat,
  );

  fastify.get(
    '/products/:productId',
    {
      schema: schemas.getProductById,
      onRequest: optionalAuth,
    },
    handlers.getProductById,
  );
}

export default routes;
