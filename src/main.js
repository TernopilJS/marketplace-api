import '@babel/polyfill';
import fastify from 'fastify';
import fastifyOAS from 'fastify-oas';
import fastifyJwt from 'fastify-jwt';
import multipart from 'fastify-multipart';
import SocketServer from 'socket.io';
import sockets from './services/sockets';
import modules from './modules';
import swagger from './swagger';
import config from './config';

// create server
const app = fastify({
  logger: true,
})
  .register(fastifyJwt, {
    secret: config.app.secret1,
  })
  .register(multipart)
  .register(fastifyOAS, swagger)
  .register(modules);

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
