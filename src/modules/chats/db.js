import { get, getList, sql } from '../../services/database';

export function getChats(userId) {
  const query = sql`
    SELECT
      c.*,
      c.participants as participantsIds,
      users.participants as participants,
      (
        c.product::jsonb ||
        json_build_object(
          'saved',
          EXISTS(
            SELECT * FROM saved_products AS s
            WHERE s.product_id = (c.product->>'id')::UUID
              AND s.owner_id = '14289d7a-af06-49c5-9286-4a260b748f53'::UUID
          )
        )::jsonb
      ) as product
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
  `;

  return getList(query, [userId]);
}

export function createMessage({ chatId, userId, text }) {
  const query = sql`
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
  `;

  return get(query, [chatId, userId, text]);
}

export function getMessages({ chatId, limit, from }) {
  const query = sql`
    SELECT m.*
    FROM views.messages AS m
    WHERE m.chat_id = $1
      AND CASE WHEN $2::INT IS NOT NULL
        THEN m.id < $2
        ELSE TRUE
      END
    ORDER BY created_at DESC
    FETCH FIRST $3 ROWS ONLY;
  `;

  return getList(query, [chatId, from, limit]);
}

export function createChat({ id, productId, userId }) {
  const query = sql`
    WITH participant as (
      SELECT ARRAY[p.owner_id, $3] as participants
      FROM products as p
      WHERE p.id = $2
    )
    INSERT INTO
    chat.chats(id, product_id, owner_id, participants)
    (SELECT $1, $2, $3, participants from participant)
    RETURNING *;
  `;

  return get(query, [id, productId, userId]);
}
