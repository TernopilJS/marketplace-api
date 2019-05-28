import '@babel/polyfill';
import fastify from 'fastify';
import fastifySwagger from 'fastify-swagger';
import fastifyJwt from 'fastify-jwt';
import multipart from 'fastify-multipart';
import SocketServer from 'socket.io';
import sockets from './services/sockets';
import declareRouters from './routes';
import config from './config';

// create server
const app = fastify({
  logger: true,
});

// register jwt
app.register(fastifyJwt, {
  secret: config.app.secret1,
});

// register multipart
app.register(multipart);

// register dynamic swagger docs
app.register(fastifySwagger, {
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
app.register(declareRouters);

// create socket server
const io = new SocketServer(app.server, {
  pingTimeout: 5000,
  pingInterval: 1000,
});
app.register(sockets.init, { io });

// Run the server!
const start = async () => {
  try {
    await app.listen(config.port, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    console.log(err);
    process.exit(1);
  }
};

start();
