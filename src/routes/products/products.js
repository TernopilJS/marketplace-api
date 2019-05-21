import uuid from 'uuid/v4';
import { get, getList } from '../../services/database';

async function productsRoutes(fastify) {
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
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            ownerId: { type: 'string' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            photos: {
              anyOf: [
                { type: 'null' },
                { type: 'array', items: { type: 'string' } },
              ],
            },
            location: { type: 'string' },
            price: { type: 'number' },
            createdAt: { type: 'number' },
            updatedAt: { type: ['number', 'null'] },
          },
        },
      },
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

  fastify.route({
    method: 'GET',
    url: '/products/latest',
    schema: {
      tags: ['products'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              ownerId: { type: 'string' },
              title: { type: 'string' },
              description: { type: ['string', 'null'] },
              photos: {
                anyOf: [
                  { type: 'null' },
                  {
                    type: 'array',
                    items: { type: 'string' },
                  },
                ],
              },
              location: { type: 'string' },
              price: { type: 'number' },
              createdAt: { type: 'number' },
              updatedAt: { type: ['number', 'null'] },
            },
          },
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

export default productsRoutes;
