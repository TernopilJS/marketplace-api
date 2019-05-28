import { get } from '../../services/database';
import { chatSchemas } from '../../schemas';

async function createMessage(fastify) {
  fastify.route({
    method: 'POST',
    url: '/chats/:chatId/messages',
    schema: {
      tags: ['chat'],
      body: {
        type: 'object',
        properties: {
          text: { type: 'string' },
        },
      },
      response: {
        200: chatSchemas.message,
      },
    },
    handler: async (req, res) => {
      const { chatId } = req.params;
      const { userId } = req.user;
      const { text } = req.body;

      try {
        const messages = await get(
          `
            INSERT INTO
            chat.messages(id, chat_id, owner_id, text)
            VALUES (seq.next_message_id($1), $1, $2, $3)
            ON CONFLICT ON CONSTRAINT messages_pk
              DO UPDATE SET id = seq.next_message_id($1)
            RETURNING *;
          `,
          [chatId, userId, text],
        );

        res.send(messages);
      } catch (error) {
        if (error.constraint === 'message_owner_fk') {
          res.status(403).send({ error: 'Unauthorized' });
          return;
        }

        if (error.constraint === 'message_chat_fk') {
          res.status(404).send({ error: 'chat not found' });
          return;
        }

        throw error;
      }
    },
  });
}

export default createMessage;
