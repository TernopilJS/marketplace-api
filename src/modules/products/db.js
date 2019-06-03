import { get, getList, sql } from '../../services/database';

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

export function getLatestProducts() {
  const query = sql`
    SELECT * FROM views.active_products
    ORDER BY created_at DESC
    FETCH FIRST 20 ROWS ONLY;
  `;

  return getList(query);
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
    SELECT p.*, c.id as chat_id
    FROM views.active_products_with_user AS p
      LEFT JOIN chat.chats AS c
        ON (c.product_id = p.id AND c.owner_id = $2)
    WHERE p.id = $1;
  `;

  return get(query, [productId, userId]);
}
