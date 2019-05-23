import { get } from '../../services/database';
import { userSchemas } from '../../schemas';

async function account(fastify) {
  fastify.addHook('onRequest', async (req) => req.jwtVerify());

  fastify.route({
    method: 'GET',
    url: '/account/user',
    schema: {
      tags: ['user'],
      response: {
        200: userSchemas.user,
      },
    },
    handler: async (req, res) => {
      const { userId } = req.user;
      const user = await get('SELECT * FROM views.users WHERE id = $1', [
        userId,
      ]);

      if (!user) {
        res.status(404).send({ error: 'user not found' });
        return;
      }

      res.send(user);
    },
  });

  fastify.route({
    method: 'PUT',
    url: '/account/user',
    schema: {
      tags: ['user'],
      body: {
        type: 'object',
        properties: {
          avatar: { type: 'string' },
          fullName: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      response: {
        200: userSchemas.user,
      },
    },
    handler: async (req, res) => {
      const { userId } = req.user;
      const { avatar, fullName, phone } = req.body;

      const updatedUser = await get(
        `
        UPDATE users
        SET full_name = $2, avatar = $3, phone = $4
        WHERE id = $1
        RETURNING *;
        `,
        [userId, fullName, avatar, phone],
      );

      if (!updatedUser) {
        res.status(404).send({ error: 'user not found' });
        return;
      }

      res.send(updatedUser);
    },
  });
}

export default account;
