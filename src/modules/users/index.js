import * as schemas from './routesSchemas';
import * as handlers from './handlers';

async function routes(fastify) {
  fastify.get(
    '/users/:userId/products',
    { schema: schemas.getUserProducts },
    handlers.getUserProducts,
  );
}

export default routes;
