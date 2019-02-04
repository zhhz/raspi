import socketIOClient from "socket.io-client";

class Socket {
  socket = null;
  _default_ws_server = 'localhost:3000';

  Socket(wsServer) {
    this.wsServer = wsServer || this._default_ws_server;
  }

  init(opts) {
    this.socket = socketIOClient(this.wsServer);

    this.socket.on('liveStream', opts.onLiveStream);
    this.socket.on('connected', opts.onConnected);
  }

  startStream() {
    this.socket.emit('start-stream');
  }

  stopStream() {
    this.socket.emit('disconnect-client');
  }

}

export default Socket;
