const RaspiCam = require("../pi/cam/raspicam");
const fs = require('fs');

const IMAGE_FILE = 'photo/image.png';

const DEFAULT_OPTS = {
  mode: "photo",
  output: IMAGE_FILE,
  encoding: "png",
  timeout: 0 // take the picture immediately
};


function onTakePhoto(socket, opts) {
  socket.on('cancel-photo', () => {
    camera.stop();
  });

  opts = Object.assign({}, opts, DEFAULT_OPTS);
  const camera = new RaspiCam(opts);

  camera.on("start", function( err, timestamp ){
    console.log(" => photo started at " + timestamp );
  });

  camera.on("read", function( err, timestamp, filename ){
    fs.readFile(IMAGE_FILE, function(err, buf){
      socket.emit('photo-ready', 'data:image/png;base64,' +  buf.toString('base64'));
      camera.stop();
    });
  });

  camera.on("exit", function( timestamp ){
    console.log(" => photo child process has exited at " + timestamp );
  });

  camera.start();
}

function cleanup() {
  console.log(' =>  => cleanup');
}

const wsPhotoHandler = {
  onTakePhoto,
  cleanup,
}

module.exports = wsPhotoHandler;
