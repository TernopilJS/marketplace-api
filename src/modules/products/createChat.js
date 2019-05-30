import uuid from 'uuid/v4';
import { get } from '../../services/database';
import { chatSchemas } from '../../schemas';

async function createChat(fastify) {
  fastify.route({
    method: 'POST',
    url: '/products/:productId/createChat',
    schema: {
      tags: ['chat'],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
      },
      response: {
        200: chatSchemas.chat,
      },
      security: [{ bearerAuth: [] }],
    },
    onRequest: async (req) => req.jwtVerify(),
    handler: async (req, res) => {
      const { userId } = req.user;
      const { productId } = req.params;

      try {
        const chat = await get(
          `
            WITH participant as (
              SELECT ARRAY[p.owner_id] as participants
              FROM products as p
              WHERE p.id = $2
            )
            INSERT INTO
            chat.chats(id, product_id, owner_id, participants)
            (SELECT $1, $2, $3, participants from participant)
            RETURNING *;
          `,
          [
            uuid(),
            productId,
            userId,
          ],
        );

        res.send(chat);
      } catch (error) {
        if (error.constraint === 'chat_user_fk') {
          res.status(403).send({ error: 'Unauthorized' });
          return;
        }

        if (error.constraint === 'chats_unique') {
          res.status(409).send({ error: 'Chat already exists' });
          return;
        }

        if (error.constraint === 'chat_product_fk') {
          res.status(404).send({ error: 'Product not found' });
          return;
        }

        throw error;
      }
    },
  });
}

export default createChat;
