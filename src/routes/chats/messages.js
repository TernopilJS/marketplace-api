import { getList } from '../../services/database';
import { chatSchemas } from '../../schemas';

async function getMessages(fastify) {
  fastify.route({
    method: 'GET',
    url: '/chats/:chatId/messages',
    schema: {
      tags: ['chat'],
      response: {
        200: {
          type: 'array',
          items: chatSchemas.message,
        },
      },
    },
    handler: async (req, res) => {
      const { chatId } = req.params;
      const messages = await getList(
        `
          SELECT *
          FROM views.messages
          WHERE chat_id = $1
          ORDER BY created_at DESC;
        `,
        [chatId],
      );

      res.send(messages);
    },
  });
}

export default getMessages;
