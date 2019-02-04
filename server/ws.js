var server = require('./server');
var socket = require('socket.io')(server);
const { spawn } = require('child_process');
var fs = require('fs');

const disconnectedImgLocation = 'public/images/disconnected.jpg';

const milisecondsInterval = 75;
let clients = new Map();
let connectedClients = new Map();

let raspistill; // the child process we will launch to generate images

let lastImg;

let lastBuffer;
let splitImage = (buffer, sendCallback) => {
	// SOI	0xFF, 0xD8 - Start
	// EOI  0xFF, 0xD9 - End
	if (lastBuffer) {
		buffer = Buffer.concat([lastBuffer, buffer]);
	}
	// let startIndex = buffer.indexOf(0xFFD8);
	// let endIndex = buffer.indexOf(0xFFD9);
	let image;
	console.log('Starting to get images from stdout. Buffer length: ' + buffer.length);
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
				console.log('Sending image from pos ' + lastStartPos - 1 + ' to ' + endPos);
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
	console.log('All images sent.');
	lastBuffer = buffer.slice(lastStartPos - 1);
	return image;
};

// Default value for the image
fs.readFile(disconnectedImgLocation, undefined, (err, data) => {
	lastImg = 'data:image/jpg;base64,' + data.toString('base64');
});

let disconnectFromStream = (sock) => {
	connectedClients.delete(sock.id);

	if (connectedClients.size === 0) {
		// If nobody watches then we kill the process and stop watching the file.
		console.log('No more clients, killing proccess...');
		if (raspistill) raspistill.kill();
		raspistill = undefined;
		buffer = undefined;
	} else {
		console.log('Remaining connected clients ' + connectedClients);
	}
};

socket.on('connection', sock => {

	clients.set(sock.id, sock);

	let address = sock.handshake.address;
	console.log('New connection from ' + address);

	sock.emit('connected', 'This is from the server');

	sock.on('disconnect', () => {
		console.log('Disconnected from client ' + address);
		clients.delete(sock.id);
		disconnectFromStream(sock);
	});

	sock.on('disconnect-client', () => {
		console.log('Disconnect (button) from client ' + address);
		disconnectFromStream(sock);
	});

	sock.on('start-stream', () => {
		console.log(' =>  => start streaming...');
		connectedClients.set(sock.id, sock);
		// app.set('watchingFile', true);

		// Send connected client the current image
		sock.emit('liveStream', lastImg);

		if (!raspistill) {
			console.log('No raspistill found, spawning one.');
      // let args = ['-w', '640', '-h', '480', '-o', '-', '-q', '80', '-t', '999999999', '-tl', milisecondsInterval.toString(), '--thumb', 'none'];
			let args = ['-w', '640', '-h', '480', '-o', '-', '-q', '80', '-t', '999999999', '--thumb', 'none'];

			raspistill = spawn('raspistill', args);
			raspistill.on('error', (err) => {
				console.warn('Something happened while trying to spawn the raspistill command. Maybe this\'ll help:');
				console.warn(err);
			});
			raspistill.stdout.on('data', (data) => {
				// Directly converting the data causes us to send an incomplete image. We have to check for a full image. And then send it.
				// Since there is more than one image per stdout we delegate the process to a function
				let lImg = splitImage(data, (img) => {
					connectedClients.forEach((client) => {
						client.emit('liveStream', 'data:image/jpg;base64,' + img.toString('base64'));
					});
				});
				if (lImg){
					lastImg = 'data:image/jpg;base64,' + lImg.toString('base64');
				}
			});

			raspistill.stdout.on('end', function (data) {
				console.log(' =>  =>  Raspistill ended...');
			});
		}
	});
});
