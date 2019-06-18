// import { argon2id } from 'argon2';
import os from 'os';

const isProd = process.env.NODE_ENV === 'production';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;
const protocol = isProd ? 'https' : 'http';

export default {
  host,
  port,
  protocol,
  url: `${protocol}://${host}${isProd ? '' : `:${port}`}`,

  app: {
    secret1: process.env.SECRET1 || 'APIKO_SIKRIT1',
    secret2: process.env.SECRET2 || 'APIKO_SIKRIT2',
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  },

  hash: {
    default: 'bcrypt',

    bcrypt: {
      saltRounds: 10,
    },

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
    user: process.env.PGUSER || 'postgres',
    database: process.env.PGDATABASE || 'apiko_courses',
    password: process.env.PGPASSWORD || '',
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    ssl: process.env.PGSSL || false,
  },
};
