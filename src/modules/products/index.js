import { optionalAuth, requiredAuth } from 'auth/helpers';
import * as handlers from './handlers';
import * as schemas from './routesSchemas';

async function routes(fastify) {
  fastify.get(
    '/products/latest',
    { schema: schemas.getLatestProducts, onRequest: optionalAuth },
    handlers.getLatestProducts,
  );

  fastify.post(
    '/products',
    { schema: schemas.createProduct, onRequest: requiredAuth },
    handlers.createProduct,
  );

  fastify.post(
    '/products/:productId/createChat',
    { schema: schemas.createChat, onRequest: requiredAuth },
    handlers.createChat,
  );

  fastify.get(
    '/products/:productId',
    { schema: schemas.getProductById, onRequest: optionalAuth },
    handlers.getProductById,
  );

  fastify.post(
    '/products/:productId/save',
    { schema: schemas.saveProduct, onRequest: requiredAuth },
    handlers.saveProduct,
  );

  fastify.post(
    '/products/:productId/unsave',
    { schema: schemas.unSaveProduct, onRequest: requiredAuth },
    handlers.unSaveProduct,
  );

  fastify.get(
    '/products/saved',
    { schema: schemas.getSavedProducts, onRequest: requiredAuth },
    handlers.getSavedProducts,
  );

  fastify.post(
    '/products/saved',
    { schema: schemas.saveMultipleProducts, onRequest: requiredAuth },
    handlers.saveMultipleProducts,
  );

  fastify.get(
    '/products/ids',
    { schema: schemas.getProductsByIds, onRequest: optionalAuth },
    handlers.getProductsByIds,
  );
}

export default routes;
