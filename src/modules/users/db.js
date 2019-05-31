import { get, getList } from '../../services/database';

export function getUserProducts(userId) {
  return getList(
    `
      SELECT *, count(*) over () as count
      FROM views.active_products
      WHERE owner_id = $1
      ORDER BY created_at DESC;
    `,
    [userId],
  );
}

export function createUser({
  id, email, fullName, passwordHash, hashFunc,
}) {
  return get(
    `
      INSERT INTO
      users(id, email, full_name, password_hash, password_hash_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
    [id, email, fullName, passwordHash, hashFunc],
  );
}

export function getUser(userId) {
  return get('SELECT * FROM views.users WHERE id = $1', [userId]);
}

export function getUserByEmail(email) {
  return get('SELECT * FROM views.users WHERE email = $1', [email]);
}

export function updateUser({
  userId, fullName, avatar, phone,
}) {
  return get(
    `
      UPDATE users
      SET
        full_name = $2,
        avatar = $3,
        phone = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `,
    [userId, fullName, avatar, phone],
  );
}
