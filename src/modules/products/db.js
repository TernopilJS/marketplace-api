import { get, getList } from '../../services/database';

export function createProduct({
  id,
  userId,
  title,
  description,
  photos,
  location,
  price,
}) {
  return get(
    `
      INSERT INTO
      products(id, owner_id, title, description, photos, location, price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
    [id, userId, title, description, photos, location, price],
  );
}

export function getLatestProducts() {
  return getList(
    `
    SELECT * FROM views.active_products
    ORDER BY created_at DESC
    FETCH FIRST 20 ROWS ONLY;
    `,
  );
}

export function getProductById({ productId }) {
  return get(
    `
      SELECT *
      FROM views.active_products_with_user AS product
      WHERE product.id = $1;
    `,
    [productId],
  );
}

export function getProductWithChat({ productId, userId }) {
  return get(
    `
      SELECT p.*, c.id as chat_id
      FROM views.active_products_with_user AS p
        LEFT JOIN chat.chats AS c
          ON (c.product_id = p.id AND c.owner_id = $2)
      WHERE p.id = $1;
    `,
    [productId, userId],
  );
}
