import _ from 'lodash/fp';
import uuid from 'uuid/v4';
import * as chatDb from 'chats/db';
import * as db from './db';

export async function createChat(req, res) {
  const { userId } = req.user;
  const { productId } = req.params;

  try {
    const chat = await chatDb.createChat({
      id: uuid(),
      productId,
      userId,
    });

    if (!chat) {
      res.status(409).send({ error: 'Cannot create the chat' });
      return;
    }

    res.send(chat);
  } catch (error) {
    if (error.constraint === 'chat_user_fk') {
      res.status(403).send({ error: 'Unauthorized' });
      return;
    }

    if (error.constraint === 'chats_unique') {
      res.status(409).send({ error: 'Chat already exists' });
      return;
    }

    if (error.constraint === 'chat_product_fk') {
      res.status(404).send({ error: 'Product not found' });
      return;
    }

    throw error;
  }
}

export async function createProduct(req, res) {
  const { userId } = req.user;
  const {
    title, description, photos, location, price,
  } = req.body;

  try {
    const product = await db.createProduct({
      id: uuid(),
      userId,
      title,
      description,
      photos,
      location,
      price,
    });

    res.send(product);
  } catch (error) {
    if (error.constraint === 'products_owner_fk') {
      res.status(403).send({ error: 'Unauthorized' });
      return;
    }

    throw error;
  }
}

export async function getLatestProducts(req, res) {
  const userId = _.get('user.userId')(req);
  const { limit, offset } = req.query;

  const products = await db.getLatestProducts({ userId, limit, offset });
  res.send(products);
}

export async function getProductById(req, res) {
  const { productId } = req.params;
  const userId = _.get('user.userId')(req);

  const getProduct = userId ? db.getProductWithChat : db.getProductById;

  const product = await getProduct({ productId, userId });

  if (!product) {
    res.status(404).send({ error: 'product not found' });
    return;
  }

  res.send(product);
}

export async function saveProduct(req, res) {
  const { productId } = req.params;
  const { userId } = req.user;

  try {
    const saved = await db.saveProduct({ productId, userId });

    if (!saved) {
      res.status(409).send({ error: 'Cannot save the product' });
      return;
    }

    res.status(200).send();
  } catch (error) {
    if (error.constraint === 'saved_products_pkey') {
      res.status(409).send({ error: 'Product already saved' });
      return;
    }

    if (error.constraint === 'saved_products_product_fk') {
      res.status(404).send({ error: 'Product not found' });
      return;
    }

    if (error.constraint === 'saved_products_owner_fk') {
      res.status(403).send({ error: 'Unauthorized' });
      return;
    }

    throw error;
  }
}

export async function unSaveProduct(req, res) {
  const { productId } = req.params;
  const { userId } = req.user;

  await db.unSaveProduct({ productId, userId });

  res.status(200).send();
}

export async function getSavedProducts(req, res) {
  const { userId } = req.user;

  const products = await db.getSavedProducts({ userId });

  res.send(products);
}

export async function saveMultipleProducts(req, res) {
  const { userId } = req.user;
  const { ids } = req.body;

  await db.saveMultipleProducts({ userId, ids });

  res.status(200).send();
}

export async function getProductsByIds(req, res) {
  const userId = _.get('user.userId')(req);
  const { id } = req.query;
  const ids = Array.isArray(id) ? id : [id];

  const products = await db.getProductsByIds({ userId, ids });

  res.send(products);
}

export async function searchProducts(req, res) {
  const userId = _.get('user.userId')(req);
  const {
    keywords, location, priceFrom, priceTo, limit, offset,
  } = req.query;

  if (!keywords && !location) {
    res.status(400).send({
      // prettier-ignore
      error: 'required at least one of the properties "keywords" or "location"',
    });

    return;
  }

  const products = await db.searchProducts({
    userId,
    keywords,
    location,
    priceFrom,
    priceTo,
    limit,
    offset,
  });

  res.send(products);
}
