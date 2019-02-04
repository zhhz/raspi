import socketIOClient from "socket.io-client";

class Socket {
  socket = null;
  _default_ws_address = 'http://localhost:3000';

  constructor(address) {
    this.address = address;
  }

  init(opts) {
    this.socket = socketIOClient(this.address || this._default_ws_address);

    this.socket.on('connected', opts.onConnected);
    this.socket.on('liveStream', opts.onLiveStream);
  }

  startStream() {
    this.socket.emit('start-stream');
  }

  stopStream() {
    this.socket.emit('disconnect-client');
  }

}

export default Socket;
