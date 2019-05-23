import { get } from '../../services/database';
import { productSchemas } from '../../schemas';

async function productById(fastify) {
  fastify.route({
    method: 'GET',
    url: '/products/:productId',
    schema: {
      tags: ['products'],
      response: {
        200: productSchemas.productWithUser,
      },
    },
    handler: async (req, res) => {
      const { productId } = req.params;
      const product = await get(
        `
          SELECT * FROM views.active_products_with_user AS product
          WHERE product.id = $1
        `,
        [productId],
      );

      if (!product) {
        res.status(404).send({ error: 'product not found' });
        return;
      }

      res.send(product);
    },
  });
}

export default productById;
