import { getList } from '../../services/database';
import { productSchemas } from '../../schemas';

async function latestProducts(fastify) {
  fastify.route({
    method: 'GET',
    url: '/products/latest',
    schema: {
      tags: ['products'],
      response: {
        200: {
          type: 'array',
          items: productSchemas.product,
        },
      },
    },
    handler: async (req, res) => {
      const products = await getList(
        `
        SELECT * FROM views.active_products
        ORDER BY created_at DESC
        FETCH FIRST 20 ROWS ONLY;
        `,
      );

      res.send(products);
    },
  });
}

export default latestProducts;
