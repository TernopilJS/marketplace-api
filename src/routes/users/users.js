import _ from 'lodash/fp';
import { getList } from '../../services/database';
import { productSchemas } from '../../schemas';

async function productsRoutes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/users/:userId/products',
    schema: {
      tags: ['products'],
      response: {
        200: {
          type: 'object',
          properties: {
            list: {
              type: 'array',
              items: productSchemas.product,
            },
            count: { type: 'number' },
          },
        },
      },
    },
    onRequest: async (req) => req.jwtVerify(),
    handler: async (req, res) => {
      const { userId } = req.params;
      const products = await getList(
        `
        SELECT *, count(*) over () as count
        FROM views.active_products
        WHERE owner_id = $1
        ORDER BY created_at DESC;
        `,
        [userId],
      );

      const count = _.getOr(0, '[0].count')(products);
      res.send({ list: products, count });
    },
  });
}

export default productsRoutes;
