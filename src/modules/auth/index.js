import * as schemas from './routesSchemas';
import * as handlers from './handlers';

async function routes(fastify) {
  fastify.post('/auth/login', { schema: schemas.login }, handlers.login);
  fastify.post(
    '/auth/register',
    { schema: schemas.register },
    handlers.register,
  );
}

export default routes;
