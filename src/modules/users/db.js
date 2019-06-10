import * as productDb from 'products/db';
import {
  get, getList, sql, safeParams, useIf,
} from '../../services/database';

export function getUserProducts({ userId, sessionUserId }) {
  const query = sql`
    SELECT
      p.*,
      ${useIf(sessionUserId, productDb.getProductSavedState('$2'))}
      count(*) over () as count
    FROM views.active_products as p
    WHERE p.owner_id = $1
    ORDER BY p.created_at DESC;
  `;

  return getList(query, safeParams([userId, sessionUserId]));
}

export function createUser({
  id, email, fullName, passwordHash, hashFunc,
}) {
  const query = sql`
    INSERT INTO
    users(id, email, full_name, password_hash, password_hash_type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  return get(query, [id, email, fullName, passwordHash, hashFunc]);
}

export function getUser(userId) {
  return get(sql`SELECT * FROM views.users_location WHERE id = $1`, [userId]);
}

export function getUserByEmail(email) {
  return get(sql`SELECT * FROM views.users_location WHERE email = $1`, [
    email,
  ]);
}

export function updateUser({
  userId, fullName, avatar, phone, location,
}) {
  const query = sql`
    UPDATE users
    SET
      full_name = $2,
      avatar = $3,
      phone = $4,
      location = $5,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  return get(query, [userId, fullName, avatar, phone, location]);
}
