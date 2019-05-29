import fastJson from 'fast-json-stringify';
import { get } from '../../services/database';
import sockets from '../../services/sockets';
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
        const message = await get(
          `
            WITH insert_data as (
              INSERT INTO
              chat.messages(id, chat_id, owner_id, text)
              VALUES (seq.next_message_id($1), $1, $2, $3)
              ON CONFLICT ON CONSTRAINT messages_pk
                DO UPDATE SET id = seq.next_message_id($1)
              RETURNING *
            )
            SELECT i.*, c.participants
            FROM insert_data as i
              LEFT JOIN chat.chats AS c ON (c.id = i.chat_id)
          `,
          [chatId, userId, text],
        );

        try {
          sockets.sendMessage(
            message.participants,
            fastJson(chatSchemas.message)(message),
          );
        } catch (error) {
          // do nothing
        }

        res.send(message);
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
