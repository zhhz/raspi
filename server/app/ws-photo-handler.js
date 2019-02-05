const { spawn } = require('child_process');

let photoClients = new Map();

const disconnectedImgLocation = 'public/images/disconnected.jpg';
let raspistill; // the child process we will launch to generate images
let lastBuffer;

function onTakePhoto(socket) {

  console.log(' =>  => start streaming...');
  photoClients.set(socket.id, socket);

  if (!raspistill) {
    console.log(' =>  => No raspistill found, spawning one.');
    let args = ['-w', '1280', '-h', '1024', '-o', '-', '-q', '100', '--thumb', 'none'];

    raspistill = spawn('raspistill', args);
    raspistill.on('error', (err) => {
      console.warn('Something happened while trying to spawn the raspistill command. Maybe this\'ll help:');
      console.warn(err);
    });
    raspistill.stdout.on('data', (data) => {
      // Directly converting the data causes us to send an incomplete image. We have to check for a full image. And then send it.
      // Since there is more than one image per stdout we delegate the process to a function
      let lImg = splitImage(data, (img) => {
        photoClients.forEach((client) => {
          client.emit('liveStream', 'data:image/jpg;base64,' + img.toString('base64'));
        });
      });
    });

    raspistill.stdout.on('end', function (data) {
      console.log(' =>  =>  Raspistill ended...');
      disconnect(socket);
    });
  } else {
    // Send connected client the current image
    console.log(' =>  => second client is asking to take a photo')
  }

  socket.on('disconnect-photo', () => {
    console.log(' =>  => Client canceled connection: ' + address);
    disconnect(socket);
  });
}

function disconnect(socket) {
  photoClients.delete(socket.id);

  if (photoClients.size === 0) {
    console.log(' =>  => No more clients, killing proccess...');
    if (raspistill) raspistill.kill();
    raspistill = undefined;
    buffer = undefined;
  } else {
    console.log(' =>  => Remaining connected clients ' + photoClients);
  }
};

function splitImage(buffer, sendCallback) {
  // SOI	0xFF, 0xD8 - Start
  // EOI  0xFF, 0xD9 - End
  if (lastBuffer) {
    buffer = Buffer.concat([lastBuffer, buffer]);
  }
  // let startIndex = buffer.indexOf(0xFFD8);
  // let endIndex = buffer.indexOf(0xFFD9);
  let image;
  console.log(' =>  => Starting to get images from stdout. Buffer length: ' + buffer.length);
  //TODO: this would be quicker if we would iterate the buffer byte by byte

  let specialByte = false;
  let lastStartPos;
  for (let i = 0, l = buffer.length; i < l; i++) {
    let byte = buffer[i];
    if (specialByte) {
      if (byte === 0xD8) {// Start
        lastStartPos = i;
      } else if (byte === 0xD9) { // End
        let endPos = i;
        console.log(' =>  => Sending image from pos ' + lastStartPos - 1 + ' to ' + endPos);
        image = buffer.slice(lastStartPos - 1, endPos);
        sendCallback(image);
      }
    }
    if (byte === 0xFF) {
      specialByte = true;
    } else {
      specialByte = false;
    }
  }
  console.log(' =>  => All images sent.');
  lastBuffer = buffer.slice(lastStartPos - 1);
  return image;
};

const wsPhotoHandler = {
  onTakePhoto,
  disconnect,
}

module.exports = wsPhotoHandler;
