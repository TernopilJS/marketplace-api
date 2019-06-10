import {
  get, getList, sql, safeParams,
} from '../../services/database';

export function getProductJsonWithSaved(condition, productJson, paramName) {
  const withSaved = sql`
    (
      ${productJson}::jsonb ||
      json_build_object(
        'saved',
        EXISTS(
          SELECT * FROM saved_products AS s
          WHERE s.product_id = (${productJson}->>'id')::UUID
            AND s.owner_id = ${paramName}::UUID
        )
      )::jsonb
    ) as product,
  `;

  return condition ? withSaved : '';
}

export function getProductSavedState(condition, paramName) {
  const withSaved = sql`
    EXISTS(
      SELECT * FROM saved_products AS s
      WHERE s.product_id = p.id
        AND s.owner_id = ${paramName}
    ) AS saved,
  `;

  return condition ? withSaved : '';
}

export function createProduct({
  id,
  userId,
  title,
  description,
  photos,
  location,
  price,
}) {
  const query = sql`
    INSERT INTO
    products(id, owner_id, title, description, photos, location, price)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  return get(query, [
    id,
    userId,
    title,
    description,
    photos,
    location,
    price,
  ]);
}

export function getLatestProducts(userId) {
  const query = sql`
    SELECT
      ${getProductSavedState(userId, '$1')}
      p.*
    FROM views.active_products as p
    ORDER BY created_at DESC
    FETCH FIRST 20 ROWS ONLY;
  `;

  return getList(query, safeParams([userId]));
}

export function getProductById({ productId }) {
  const query = sql`
    SELECT *
    FROM views.active_products_with_user AS product
    WHERE product.id = $1;
  `;

  return get(query, [productId]);
}

export function getProductWithChat({ productId, userId }) {
  const query = sql`
    SELECT
      ${getProductSavedState(userId, '$2')}
      p.*,
      c.id AS chat_id
    FROM views.active_products_with_user AS p
      LEFT JOIN chat.chats AS c
        ON (c.product_id = p.id AND c.owner_id = $2)
    WHERE p.id = $1;
  `;

  return get(query, [productId, userId]);
}

export function saveProduct({ productId, userId }) {
  const query = sql`
    INSERT INTO
      saved_products(product_id, owner_id)
    SELECT $1, $2
    FROM products AS p
    WHERE p.id = $1
      AND NOT p.owner_id = $2
    RETURNING *
  `;

  return get(query, [productId, userId]);
}

export function unSaveProduct({ productId, userId }) {
  const query = sql`
    DELETE FROM saved_products
    WHERE product_id = $1 AND owner_id = $2
  `;

  return get(query, [productId, userId]);
}

export function getSavedProducts({ userId }) {
  const query = sql`
    SELECT p.*, TRUE as saved
    FROM saved_products as s
      LEFT JOIN views.active_products AS p ON (s.product_id = p.id)
    WHERE s.owner_id = $1
    ORDER BY s.created_at DESC
  `;

  return getList(query, [userId]);
}

export function saveMultipleProducts({ userId, ids }) {
  const query = sql`
    INSERT INTO
      saved_products(product_id, owner_id)
    SELECT p.id, $2
    FROM UNNEST($1::UUID[]) AS ids
      LEFT JOIN products AS p ON (p.id = ids)
    WHERE NOT p.owner_id = $2
    RETURNING *
  `;

  return get(query, [ids, userId]);
}

export function getProductsByIds({ userId, ids }) {
  const query = sql`
    SELECT
      ${getProductSavedState(userId, '$2')}
      p.*
    FROM UNNEST($1::UUID[]) AS ids
      LEFT JOIN views.active_products AS p ON (p.id = ids)
    ORDER BY created_at DESC;
  `;

  return getList(query, safeParams([ids, userId]));
}
