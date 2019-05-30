import _ from 'lodash/fp';
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
    onRequest: async (req) => {
      try {
        await req.jwtVerify();
      } catch (error) {
        // do nothing
      }
    },
    handler: async (req, res) => {
      const { productId } = req.params;
      const userId = _.get('user.userId')(req);

      let query = `
        SELECT *
        FROM views.active_products_with_user AS product
        WHERE product.id = $1
      `;
      const params = [productId];

      if (userId) {
        query = `
          SELECT p.*, c.id as chat_id
          FROM views.active_products_with_user AS p
            LEFT JOIN chat.chats AS c
              ON (c.product_id = p.id AND c.owner_id = $2)
          WHERE p.id = $1
        `;
        params.push(userId);
      }

      const product = await get(query, params);

      if (!product) {
        res.status(404).send({ error: 'product not found' });
        return;
      }

      res.send(product);
    },
  });
}

export default productById;
