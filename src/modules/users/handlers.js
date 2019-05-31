import _ from 'lodash/fp';
import * as db from './db';

export async function getUserProducts(req, res) {
  const { userId } = req.params;

  const products = await db.getUserProducts(userId);
  const count = _.getOr(0, '[0].count')(products);

  res.send({ list: products, count });
}
