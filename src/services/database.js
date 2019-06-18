import _ from 'lodash/fp';
import { Pool } from 'pg';
import config from '../config';
import { checkType } from '../utils';

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

export async function runQuery(...params) {
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
  const result = await runQuery(...params);
  const obj = _.get('rows[0]')(result);

  if (!obj) {
    return null;
  }

  return camelizeObject(obj);
}

export async function getList(...params) {
  const result = await runQuery(...params);
  const arr = _.getOr([], 'rows')(result);

  return arr.map(camelizeObject);
}

export function ifDef(value, queryToUse, defaultQuery = sql``) {
  if (typeof value !== 'undefined') {
    return queryToUse;
  }

  return defaultQuery;
}

export function sql(strings, ...options) {
  const allStrings = [];
  const allParams = [];

  strings.forEach((value, i) => {
    const param = options[i];
    const prevParam = options[i - 1];

    if (checkType.isObject(param)) {
      if (checkType.isObject(prevParam)) {
        const lastString = _.last(allStrings) || '';
        const str = value.concat(param.strings[0] || '');
        const stringsToAdd = [
          lastString.concat(str),
          ...param.strings.slice(1),
        ];

        allStrings.splice(allStrings.length - 1, 1, ...stringsToAdd);
      } else {
        const str = value.concat(param.strings[0] || '');

        allStrings.push(str, ...param.strings.slice(1));
      }

      allParams.push(...param.options);
    } else {
      if (checkType.isObject(prevParam)) {
        const lastString = _.last(allStrings) || '';
        allStrings.splice(allStrings.length - 1, 1, lastString.concat(value));
      } else {
        allStrings.push(value);
      }

      if (typeof param !== 'undefined') {
        allParams.push(param);
      }
    }
  });

  function create() {
    const params = _.uniq(allParams);

    const query = allStrings.reduce((acc, str, i) => {
      const param = params.indexOf(allParams[i]);
      return acc.concat(str, param !== -1 ? `$${param + 1}` : '');
    }, '');

    return {
      query,
      params,
    };
  }

  return { create, strings: allStrings, options: allParams };
}
