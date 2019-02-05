const server = require('./server');
const socket = require('socket.io')(server);
const wsPhotoHandler = require('./ws-photo-handler');

const clients = new Map();

socket.on('connection', sock => {
  clients.set(sock.id, sock);

  let address = sock.handshake.address;
  console.log(' => New connection from ' + address);

  sock.emit('connected', 'This is from the server');

  sock.on('disconnect', () => {
    console.log('Disconnected from client ' + address);
    clients.delete(sock.id);

    wsPhotoHandler.disconnect(sock);
  });

  sock.on('take-photo', () => wsPhotoHandler.onTakePhoto(sock));

});
