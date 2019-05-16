import argon2 from 'argon2';
import config from '../config';

export const hashArgon2 = async (cleartext) =>
  argon2.hash(cleartext, config.hash.argon2);

export const compareArgon2 = async (cleartext, hash) =>
  argon2.verify(hash, cleartext);

export const algorithms = {
  argon2: {
    hash: hashArgon2,
    compare: compareArgon2,
  },
};

export default {
  async hash(hashFuncName, cleartext) {
    if (hashFuncName in algorithms) {
      return algorithms[hashFuncName].hash(cleartext);
    }

    throw new Error(`Unknown hash function ${hashFuncName}`);
  },

  compare(hashFuncName, cleartext, hash) {
    if (hashFuncName in algorithms) {
      return algorithms[hashFuncName].compare(cleartext, hash);
    }

    throw new Error(`Unknown hash function ${hashFuncName}`);
  },
};
