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
        return next(new Error('not valid token'));
      }
    });
  }

  sendTo(rooms, event, data) {
    if (!this.io || !rooms) return;

    if (Array.isArray(rooms)) {
      const to = rooms.reduce((socket, room) => socket.to(room), this.io);
      to.emit(event, data);
    } else {
      this.io.to(rooms).emit(event, data);
    }
  }

  sendMessage(rooms, data) {
    this.sendTo(rooms, 'message', data);
  }

  sendEvent(rooms, data) {
    this.sendTo(rooms, 'event', data);
  }
}

export default new SocketsService();
