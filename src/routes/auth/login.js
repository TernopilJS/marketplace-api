import { get } from '../../services/database';
import passwords from '../../services/passwords';

async function login(fastify) {
  fastify.route({
    method: 'POST',
    url: '/auth/login',
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
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
      const { password, email } = req.body;

      const user = await get(
        'SELECT * FROM views.users WHERE email = $1;',
        [email],
      );

      if (!user) {
        res.status(404).send({ error: 'user not found' });
      }

      const passwordMatches = await passwords.compare(
        user.passwordHashType,
        password,
        user.passwordHash.toString('utf-8'),
      );

      if (!passwordMatches) {
        res.status(401).send({ error: 'wrong password' });
      }

      const token = fastify.jwt.sign({
        userId: user.id,
        iat: Date.now(),
      });
      console.log(token);

      res.send({ token, user });
    },
  });
}

export default login;
