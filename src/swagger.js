import config from './config';

export default {
  swagger: {
    info: {
      title: 'Apiko API',
      description: 'API for Apiko spring courses 2019',
      version: '0.1.0',
    },
    servers: [{ url: config.url }],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{ name: 'user', description: 'User related end-points' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  exposeRoute: true,
};
