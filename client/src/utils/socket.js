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
    this.socket.on('photo', opts.onLiveStream);
  }

  takePhoto() {
    this.socket.emit('take-photo');
  }

  forceQuit() {
    this.socket.emit('disconnect-photo');
  }

}

export default Socket;
