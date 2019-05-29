import { getList } from '../../services/database';
import { chatSchemas } from '../../schemas';

async function getChats(fastify) {
  fastify.route({
    method: 'GET',
    url: '/chats',
    schema: {
      tags: ['chat'],
      response: {
        200: {
          type: 'array',
          items: chatSchemas.chatWithProductAndMessage,
        },
      },
      security: [{ bearerAuth: [] }],
    },
    handler: async (req, res) => {
      const { userId } = req.user;

      const chats = await getList(
        `
          SELECT * FROM views.chats_with_product_and_message as c
          WHERE
            c.owner_id = $1
            OR ARRAY[$1] <@ c.participants
        `,
        [userId],
      );

      res.send(chats);
    },
  });
}

export default getChats;
