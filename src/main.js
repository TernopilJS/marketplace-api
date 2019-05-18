import '@babel/polyfill';
import fastify from 'fastify';
import fastifySwagger from 'fastify-swagger';
import fastifyJwt from 'fastify-jwt';
import declareRouters from './routes';
import config from './config';

// create server
const server = fastify({
  logger: true,
});

// register jwt
server.register(fastifyJwt, {
  secret: config.app.secret1,
});

// register dynamic swagger docs
server.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Apiko API',
      description: 'API for Apiko spring courses 2019',
      version: '0.1.0',
    },
    host: config.host,
    port: config.port,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{ name: 'user', description: 'User related end-points' }],
  },
  exposeRoute: true,
});

// Declare a routes
server.register(declareRouters);

// Run the server!
const start = async () => {
  try {
    await server.listen(config.port);
  } catch (err) {
    server.log.error(err);
    console.log(err);
    process.exit(1);
  }
};

start();
