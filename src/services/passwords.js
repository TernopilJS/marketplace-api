// import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import config from '../config';

// export const hashArgon2 = async (cleartext) =>
//   argon2.hash(cleartext, config.hash.argon2);

// export const compareArgon2 = async (cleartext, hash) =>
//   argon2.verify(hash, cleartext);

export const hashBcrypt = (text) =>
  bcrypt.hash(text, config.hash.bcrypt.saltRounds);

export const compareBcrypt = (text, hash) =>
  bcrypt.compare(text, hash);

export const algorithms = {
  bcrypt: {
    hash: hashBcrypt,
    compare: compareBcrypt,
  },

  // argon2: {
  //   hash: hashArgon2,
  //   compare: compareArgon2,
  // },
};

export default {
  hash(hashFuncName, cleartext) {
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
