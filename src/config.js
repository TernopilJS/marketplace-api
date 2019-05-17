// import { argon2id } from 'argon2';
import os from 'os';

export default {
  host: 'localhost',
  port: process.env.PORT || 8080,

  app: {
    secret1: process.env.SECRET1 || 'APIKO_SIKRIT1',
    secret2: process.env.SECRET2 || 'APIKO_SIKRIT2',
  },

  hash: {
    default: 'argon2',

    argon2: {
      hashLength: 256,
      saltLength: 64,
      memoryCost: 2 ** 16,
      timeCost: 20,
      parallelism: os.cpus().length * 2,
      // type: argon2id,
    },
  },

  db: {
    user: process.env.PGUSER || 'apiko_courses',
    database: process.env.PGDATABASE || 'apiko_courses',
    password: process.env.PGPASSWORD || 'apiko_courses',
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
  },
};
