import * as productDb from 'products/db';
import {
  get, getList, sql, ifDef,
} from '../../services/database';

export function getChats(userId) {
  const productWithSaved = productDb.getProductJsonWithSaved(
    sql`c.product`,
    userId,
  );

  const { query, params } = sql`
    SELECT
      c.*,
      ${ifDef(userId, productWithSaved)}
      c.participants as participantsIds,
      users.participants as participants
    FROM views.chats_with_product_and_message as c
      LEFT JOIN lateral (
        SELECT
          json_agg(u.user) as participants
        FROM views.users_json as u
        WHERE
          array_remove(c.participants, ${userId}) @>
          ARRAY[(u.user->>'id')::UUID]
      ) AS users ON TRUE
    WHERE
      ARRAY[${userId}::UUID] <@ c.participants
  `.create();

  return getList(query, params);
}

export function createMessage({ chatId, userId, text }) {
  const { query, params } = sql`
    WITH insert_data as (
      INSERT INTO
      chat.messages(id, chat_id, owner_id, text)
      VALUES (seq.next_message_id(${chatId}), ${chatId}, ${userId}, ${text})
      ON CONFLICT ON CONSTRAINT messages_pk
        DO UPDATE SET id = seq.next_message_id(${chatId})
      RETURNING *
    )
    SELECT i.*, array_remove(c.participants, ${userId}) as participants
    FROM insert_data as i
      LEFT JOIN chat.chats AS c ON (c.id = i.chat_id)
  `.create();

  return get(query, params);
}

export function getMessages({ chatId, limit, from }) {
  const { query, params } = sql`
    SELECT m.*
    FROM views.messages AS m
    WHERE
      m.chat_id = ${chatId}
      ${ifDef(from, sql`AND m.id < ${from}`)}
    ORDER BY created_at DESC
    FETCH FIRST ${limit} ROWS ONLY;
  `.create();

  return getList(query, params);
}

export function createChat({ id, productId, userId }) {
  const { query, params } = sql`
    WITH data_to_insert as (
      SELECT
        ${id}::UUID,
        ${productId}::UUID,
        ${userId}::UUID,
        ARRAY[p.owner_id, ${userId}] as participants
      FROM products as p
      WHERE p.id = ${productId}::UUID
        AND NOT p.owner_id = ${userId}::UUID
    )
    INSERT INTO
    chat.chats(id, product_id, owner_id, participants)
    SELECT * FROM data_to_insert
    RETURNING *;
  `.create();

  return get(query, params);
}
