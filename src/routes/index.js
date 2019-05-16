import auth from './auth';
import account from './account';

async function declareRouters(fastify, options) {
  fastify.register(auth, options);
  fastify.register(account, options);
}

export default declareRouters;

// POST /auth/register
// body: {
//   fullName: string,
//   email: string,
//   password: string,
// }

// POST /auth/login
// body: {
//   email: string,
//   password: string,
// }

// GET /account/user
// res: {
//   avatar: string,
//   fullName: string,
//   email: string,
//   phone: string,
// }

// PUT /account/user
// body: {
//   avatar?: string,
//   fullName?: string,
//   phone?: string,
// }
