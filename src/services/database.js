import _ from 'lodash/fp';
import { Pool } from 'pg';
import config from '../config';

let connected = false;

export const db = new Pool(config.db);

export async function connect() {
  if (connected) {
    return db;
  }

  try {
    const connection = await db.connect();
    connected = true;
    return connection;
  } catch (error) {
    connected = false;
    throw new Error(`Database connection failure\n${error}`);
  }
}

export const isConnected = () => connected;

export async function query(...params) {
  const conn = await connect();
  return conn.query(...params);
}

export function camelizeObject(obj) {
  return _.entries(obj).reduce((acc, [key, value]) => {
    acc[_.camelCase(key)] = value;

    return acc;
  }, {});
}

export async function get(...params) {
  const result = await query(...params);
  const obj = _.get('rows[0]')(result);

  if (!obj) {
    return null;
  }

  return camelizeObject(obj);
}

export async function getList(...params) {
  const result = await query(...params);
  const arr = _.getOr([], 'rows')(result);

  return arr.map(camelizeObject);
}

export function sql(strings, ...options) {
  return strings.reduce(
    (acc, str, i) => acc.concat(str, options[i] || ''),
    '',
  );
}

export function safeParams(params) {
  return params.reduce((acc, value) => {
    if (typeof value === 'undefined') acc.push(value);

    return acc;
  }, []);
}
