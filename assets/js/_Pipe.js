
class Pipe {
  constructor(model) {
    this.handlers = {};

    io.socket.on(model, (message) => {
      if (!message.data.type) {
        console.error('Socket message does not have a type');
        return;
      }

      if (this.handlers[message.data.type]) {
        this.handlers[message.data.type](message.data.data);
      }
    });
  }

  on(type, callback) {
    this.handlers[type] = callback;
  }
}
