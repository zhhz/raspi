const os = require('os');
const server = require('./server');
const socket = require('socket.io')(server);
const wsPhotoHandler = require('./ws-photo-handler');

const clients = new Map();

socket.on('connection', sock => {
  clients.set(sock.id, sock);

  let address = sock.handshake.address;
  console.log(' => New connection from ' + address);

  sock.emit('connected', `${os.hostname()} - ${getIpAddress()}`);

  sock.on('disconnect', () => {
    console.log('Disconnected from client ' + address);
    clients.delete(sock.id);

    wsPhotoHandler.cleanup(sock);
  });

  sock.on('take-photo', opts => wsPhotoHandler.onTakePhoto(sock, opts));

});

function getIpAddress() {
  const interfaces = require('os').networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}
