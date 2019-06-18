import {
  get, getList, sql, ifDef,
} from '../../services/database';
import { match } from '../../utils';

export function getProductJsonWithSaved(productJson, paramName) {
  return sql`
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
}

export function getProductSavedState(paramName) {
  return sql`
    EXISTS(
      SELECT * FROM saved_products AS s
      WHERE s.product_id = p.id
        AND s.owner_id = ${paramName}
    ) AS saved,
  `;
}

export function createProduct({
  id,
  userId,
  title,
  description = null,
  photos = null,
  location,
  price,
}) {
  const { query, params } = sql`
    INSERT INTO
    products(id, owner_id, title, description, photos, location, price)
    VALUES (
      ${id},
      ${userId},
      ${title}::TEXT,
      ${description}::TEXT,
      ${photos}::TEXT[],
      ${location},
      ${price}
    )
    RETURNING *;
  `.create();

  return get(query, params);
}

export function getLatestProducts({ userId, limit, offset }) {
  const { query, params } = sql`
    SELECT
      ${ifDef(userId, getProductSavedState(userId))}
      p.*
    FROM views.active_products as p
    ORDER BY created_at DESC
    OFFSET ${offset}
    FETCH FIRST ${limit} ROWS ONLY;
  `.create();

  return getList(query, params);
}

export function getProductById({ productId }) {
  const { query, params } = sql`
    SELECT *
    FROM views.active_products_with_user AS product
    WHERE product.id = ${productId};
  `.create();

  return get(query, params);
}

export function getProductWithChat({ productId, userId }) {
  const { query, params } = sql`
    SELECT
      ${ifDef(userId, getProductSavedState(userId))}
      p.*,
      c.id AS chat_id
    FROM views.active_products_with_user AS p
      LEFT JOIN chat.chats AS c
        ON (c.product_id = p.id AND c.owner_id = ${userId})
    WHERE p.id = ${productId};
  `.create();

  return get(query, params);
}

export function saveProduct({ productId, userId }) {
  const { query, params } = sql`
    INSERT INTO
      saved_products(product_id, owner_id)
    SELECT ${productId}, ${userId}
    FROM products AS p
    WHERE p.id = ${productId}
      AND NOT p.owner_id = ${userId}
    RETURNING *
  `.create();

  return get(query, params);
}

export function unSaveProduct({ productId, userId }) {
  const { query, params } = sql`
    DELETE FROM saved_products
    WHERE product_id = ${productId} AND owner_id = ${userId}
  `.create();

  return get(query, params);
}

export function getSavedProducts({ userId }) {
  const { query, params } = sql`
    SELECT p.*, TRUE as saved
    FROM saved_products as s
      LEFT JOIN views.active_products AS p ON (s.product_id = p.id)
    WHERE s.owner_id = ${userId}
    ORDER BY s.created_at DESC
  `.create();

  return getList(query, params);
}

export function saveMultipleProducts({ userId, ids }) {
  const { query, params } = sql`
    INSERT INTO
      saved_products(product_id, owner_id)
    SELECT p.id, ${userId}
    FROM UNNEST(${ids}::UUID[]) AS ids
      LEFT JOIN products AS p ON (p.id = ids)
    WHERE NOT p.owner_id = ${userId}
    RETURNING *
  `.create();

  return get(query, params);
}

export function getProductsByIds({ userId, ids }) {
  const { query, params } = sql`
    SELECT
      ${ifDef(userId, getProductSavedState(userId))}
      p.*
    FROM UNNEST(${ids}::UUID[]) AS ids
      LEFT JOIN views.active_products AS p ON (p.id = ids)
    ORDER BY created_at DESC;
  `.create();

  return getList(query, params);
}

export function searchProducts({
  userId,
  keywords,
  location,
  priceFrom,
  priceTo,
  limit,
  offset,
}) {
  const keywordsDist = sql`${keywords} <<-> p.keywords as k_dist,`;
  const locationDist = sql`${location} <<-> p.location as l_dist,`;
  const priceBigger = sql`AND p.price >= ${priceFrom}`;
  const priceLower = sql`AND p.price <= ${priceTo}`;

  const findBy = match(
    [
      [
        location && keywords,
        sql`${location} <% p.location AND ${keywords} <% p.keywords`,
      ],
      [location, sql`${location} <% p.location`],
    ],
    sql`${keywords} <% p.keywords`,
  );

  const orderBy = match(
    [
      [keywords && location, sql`l_dist, k_dist`],
      [location, sql`l_dist`],
      [keywords, sql`k_dist`],
    ],
    '',
  );

  const { query, params } = sql`
    SELECT
      ${ifDef(userId, getProductSavedState(userId))}
      ${ifDef(keywords, keywordsDist)}
      ${ifDef(location, locationDist)}
      p.*
    FROM views.products_with_keywords as p
    WHERE
      ${findBy}
      ${ifDef(priceFrom, priceBigger)}
      ${ifDef(priceTo, priceLower)}
    ORDER BY
      ${orderBy}
    OFFSET ${offset}
    FETCH FIRST ${limit} ROWS ONLY;
    ;
  `.create();

  return getList(query, params);
}
