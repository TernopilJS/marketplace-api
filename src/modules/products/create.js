import uuid from 'uuid/v4';
import { get } from '../../services/database';
import { productSchemas } from '../../schemas';

async function createProduct(fastify) {
  fastify.route({
    method: 'POST',
    url: '/products',
    schema: {
      tags: ['products'],
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          photos: {
            type: 'array',
            items: { type: 'string' },
          },
          location: { type: 'string' },
          price: { type: 'number' },
        },
        required: ['title', 'location', 'price'],
      },
      response: {
        200: productSchemas.product,
      },
      security: [{ bearerAuth: [] }],
    },
    onRequest: async (req) => req.jwtVerify(),
    handler: async (req, res) => {
      const { userId } = req.user;
      const {
        title, description, photos, location, price,
      } = req.body;

      try {
        const product = await get(
          `
            INSERT INTO
            products(id, owner_id, title, description, photos, location, price)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
          `,
          [
            uuid(),
            userId,
            title,
            description,
            photos,
            location,
            price,
          ],
        );

        res.send(product);
      } catch (error) {
        if (error.constraint === 'products_owner_fk') {
          res.status(403).send({ error: 'Unauthorized' });
          return;
        }

        throw error;
      }
    },
  });
}

export default createProduct;
