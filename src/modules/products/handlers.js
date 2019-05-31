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
  const products = await db.getLatestProducts();
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
