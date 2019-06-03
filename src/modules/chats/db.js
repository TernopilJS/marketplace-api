import { get, getList } from '../../services/database';

export function getChats(userId) {
  return getList(
    `
      SELECT
        c.*,
        c.participants as participantsIds,
        users.participants as participants
      FROM views.chats_with_product_and_message as c
        LEFT JOIN lateral (
          SELECT
            json_agg(u.user) as participants
          FROM views.users_json as u
          WHERE
            array_remove(c.participants, $1) @> ARRAY[(u.user->>'id')::UUID]
        ) AS users ON TRUE
      WHERE
        ARRAY[$1::UUID] <@ c.participants
    `,
    [userId],
  );
}

export function createMessage({ chatId, userId, text }) {
  return get(
    `
      WITH insert_data as (
        INSERT INTO
        chat.messages(id, chat_id, owner_id, text)
        VALUES (seq.next_message_id($1), $1, $2, $3)
        ON CONFLICT ON CONSTRAINT messages_pk
          DO UPDATE SET id = seq.next_message_id($1)
        RETURNING *
      )
      SELECT i.*, array_remove(c.participants, $2) as participants
      FROM insert_data as i
        LEFT JOIN chat.chats AS c ON (c.id = i.chat_id)
    `,
    [chatId, userId, text],
  );
}

export function getMessages(chatId) {
  return getList(
    `
      SELECT *
      FROM views.messages
      WHERE chat_id = $1
      ORDER BY created_at DESC;
    `,
    [chatId],
  );
}

export function createChat({ id, productId, userId }) {
  return get(
    `
      WITH participant as (
        SELECT ARRAY[p.owner_id, $3] as participants
        FROM products as p
        WHERE p.id = $2
      )
      INSERT INTO
      chat.chats(id, product_id, owner_id, participants)
      (SELECT $1, $2, $3, participants from participant)
      RETURNING *;
    `,
    [id, productId, userId],
  );
}
