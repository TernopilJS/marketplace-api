import _ from 'lodash/fp';
import * as db from './db';

export async function getUserProducts(req, res) {
  const { userId } = req.params;

  const products = await db.getUserProducts(userId);
  const count = _.getOr(0, '[0].count')(products);

  res.send({ list: products, count });
}

export async function getUser(req, res) {
  const { userId } = req.params;

  const user = await db.getUser(userId);

  if (!user) {
    res.status(404).send({ error: 'user not found' });
    return;
  }

  res.send(user);
}
