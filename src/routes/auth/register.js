import uuid from 'uuid/v4';
import { get } from '../../services/database';
import passwords from '../../services/passwords';
import config from '../../config';

async function register(fastify) {
  fastify.route({
    method: 'POST',
    url: '/auth/register',
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['fullName', 'email', 'password'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                fullName: { type: 'string' },
                email: { type: 'string' },
                avatar: { type: ['string', 'null'] },
                phone: { type: ['string', 'null'] },
              },
            },
          },
        },
      },
    },
    handler: async (req, res) => {
      const { password, fullName, email } = req.body;
      const hashFunc = config.hash.default;

      try {
        const passwordHash = await passwords.hash(hashFunc, password);
        const newUser = await get(
          `
          INSERT INTO
          users(id, email, full_name, password_hash, password_hash_type)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
          `,
          [uuid(), email, fullName, passwordHash, hashFunc],
        );

        const token = fastify.jwt.sign({
          userId: newUser.id,
          iat: Date.now(),
        });
        console.log(token);

        res.send({ token, user: newUser });
      } catch (error) {
        if (error.constraint === 'user_email_unique') {
          res.status(403).send({ error: 'email already used' });
          return;
        }

        throw error;
      }
    },
  });
}

export default register;
