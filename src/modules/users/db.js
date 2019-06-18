import * as productDb from 'products/db';
import {
  get, getList, sql, ifDef,
} from '../../services/database';

export function getUserProducts({ userId, sessionUserId }) {
  const { query, params } = sql`
    SELECT
      p.*,
      ${ifDef(sessionUserId, productDb.getProductSavedState(sessionUserId))}
      count(*) over () as count
    FROM views.active_products as p
    WHERE p.owner_id = ${userId}
    ORDER BY p.created_at DESC;
  `.create();

  return getList(query, params);
}

export function createUser({
  id, email, fullName, passwordHash, hashFunc,
}) {
  const { query, params } = sql`
    INSERT INTO
    users(id, email, full_name, password_hash, password_hash_type)
    VALUES (${id}, ${email}, ${fullName}, ${passwordHash}, ${hashFunc})
    RETURNING *;
  `.create();

  return get(query, params);
}

export function getUser(userId) {
  const { query, params } = sql`
    SELECT * FROM views.users_location WHERE id = ${userId}
  `.create();

  return get(query, params);
}

export function getUserByEmail(email) {
  const { query, params } = sql`
    SELECT * FROM views.users_location WHERE email = ${email}
  `.create();

  return get(query, params);
}

export function updateUser({
  userId, fullName, avatar, phone, location,
}) {
  const { query, params } = sql`
    UPDATE users
    SET
      full_name = ${fullName},
      avatar = ${avatar},
      phone = ${phone},
      location = ${location},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
    RETURNING *;
  `.create();

  return get(query, params);
}
