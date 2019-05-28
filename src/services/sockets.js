class SocketsService {
  constructor() {
    this.io = null;
    this.init = this.init.bind(this);
  }

  async init(fastify, { io }) {
    this.io = io;

    this.io.use((socket, next) => {
      try {
        const { token } = socket.handshake.query;
        const decodedToken = fastify.jwt.decode(token);
        const { userId } = decodedToken;

        socket.join(userId);
        return next();
      } catch (err) {
        console.log(err);
        return next(new Error('not valid token'));
      }
    });
  }

  sendMessage(userId, data) {
    if (!this.io) return;
    this.io.to(userId).emit('message', data);
  }

  sendEvent(userId, data) {
    if (!this.io) return;
    this.io.to(userId).emit('event', data);
  }
}

export default new SocketsService();
