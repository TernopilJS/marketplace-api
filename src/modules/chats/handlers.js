import fastJson from 'fast-json-stringify';
import * as db from './db';
import * as schemas from './schemas';
import * as constants from './constants';
import sockets from '../../services/sockets';

export async function getChats(req, res) {
  const { userId } = req.user;

  const chats = await db.getChats(userId);
  res.send(chats);
}

export async function createMessage(req, res) {
  const { chatId } = req.params;
  const { userId } = req.user;
  const { text } = req.body;

  try {
    const message = await db.createMessage({ chatId, userId, text });

    try {
      sockets.sendMessage(
        [userId].concat(message.participants),
        fastJson(schemas.messageWithActionType)({
          type: constants.messageActions.ADD,
          message,
        }),
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
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  const messages = await db.getMessages(chatId);
  res.send(messages);
}
