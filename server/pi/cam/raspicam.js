var events = require('events'),
  spawn = require("child_process").spawn,
  util = require("util"),
  fs = require("fs"),
  _ = require("lodash"),
  __ = require("./fn.js"),
  parameters = require("./options").parameters,
  flags = require("./options").flags;


// maximum timeout allowed by raspicam command
var INFINITY_MS = 999999999;

// flat to tell if a process is running
var PROCESS_RUNNING_FLAG = false;

// commands
var PHOTO_CMD = '/opt/vc/bin/raspistill';
var TIMELAPSE_CMD = '/opt/vc/bin/raspistill';
var VIDEO_CMD = '/opt/vc/bin/raspivid';

// the process id of the process spawned to take photos/video
var child_process = null;


// Exit strategy to kill child process
// (eg. for timelapse) on parent process exit
process.on('exit', function() {
  if(PROCESS_RUNNING_FLAG){
    child_process.kill();
  }
});


/**
 * RaspiCam
 * @constructor
 *
 * @description Raspberry Pi camera controller object
 *
 * @param {Object} args Options: mode, freq, delay, width, height, quality, encoding, filepath, filename, timeout
 */
function RaspiCam( args ) {

  if ( !(this instanceof RaspiCam) ) {
    return new RaspiCam( args );
  }

  // Ensure args is an object
  args = args || {};

  if(typeof args.mode === "undefined" || typeof args.output === "undefined"){
    console.log("Error: RaspiCam: must define mode and output");
    return false;
  }

  // Initialize this Board instance with
  // param specified properties.
  this.args = {};
  _.assign( this.args, args );

  // If any args use the abbreviation, convert to
  // the full word (eg. from args.w to args.width)
  this.hashArgs( args );

  // Set up args defaults
  this.defaultArgs( );

  // Create derivative args
  this.derivativeArgs( );

  // If this.filepath doesn't exist, make it
  this.createFilepath( );

  //child process
  this.child_process = null;

  //directory watcher
  this.watcher = null;

  //events.EventEmitter.call(this);
}

// Inherit event api
util.inherits( RaspiCam, events.EventEmitter );

/**
 *
 * hashArgs()
 *
 * Converts any abbreviated opts to their full word equivalent
 * and assigns to this.
 *
 **/
RaspiCam.prototype.hashArgs = function(args){
  for(var opt in args){
    if(opt.length <= 3){

      // if this opt is in the parameters hash
      if(typeof parameters[opt] !== "undefined"){

        // reassign it to the full word
        this.args[parameters[opt]] = args[opt];
        delete this.args[opt];
      }

      // if this opt is in the flags hash
      if(typeof flags[opt] !== "undefined"){

        // reassign it to the full word
        this.args[flags[opt]] = args[opt];
        delete this.args[opt];
      }
    }
  }
};


/**
 *
 * defaultArgs()
 *
 * Parses the args to set defaults.
 *
 **/
RaspiCam.prototype.defaultArgs = function(){

  this.args.mode = this.args.mode || 'photo';//photo, timelapse or video

  this.args.width = this.args.width || 640;
  this.args.height = this.args.height || 480;

  this.args.log = typeof this.args.log === 'function' ? this.args.log : console.log;

  // Limit timeout to the maximum value
  // supported by the Raspberry Pi camera,
  // determined by testing.
  if(typeof this.args.timeout !== "undefined"){
    this.args.timeout = Math.min( this.args.timeout, INFINITY_MS );
  }

};


/**
 *
 * derivativeArgs()
 *
 * Create any derivative args, such as filepath and filename
 *
 **/
RaspiCam.prototype.derivativeArgs = function(){

  this.filename = this.args.output.substr( this.args.output.lastIndexOf("/") + 1 );

  this.filepath = this.args.output.substr(0, this.args.output.lastIndexOf("/") + 1 ) || "./";
};


/**
 *
 * createFilepath()
 *
 * Create the filepath if it doesn't already exist.
 *
 **/
RaspiCam.prototype.createFilepath = function(){
  fs.existsSync = fs.existsSync || require('path').existsSync;
  if( !fs.existsSync( this.filepath )){
    fs.mkdirSync( this.filepath );

    // set write permissions
    fs.chmodSync( this.filepath, 0755 );
  }
};



RaspiCam.prototype.watchDirectory = function( ) {
  //alias to pass to callbacks
  var self = this;

  //close previous directory watcher if any
  if(this.watcher !== null){
    this.watcher.close();
  }

  //start watching the directory where the images will be stored to emit signals on each new photo saved
  this.watcher = fs.watch(this.filepath, function(event, filename){
    //rename is called once, change is called 3 times, so check for rename to elimate duplicates
    if(event === "rename"){
      self.args.log('raspicam::watcher::event ' + event);

      // only emit read event if it is not a temporary file
      if (filename.indexOf('~') === -1) {
        self.emit( "read", null, new Date().getTime(), filename );
      }
    }else{
      self.args.log('raspicam::watcher::event ' + event);
      self.emit( event, null, new Date().getTime(), filename );
    }
  });
};

/**
 * start Take a snapshot or start a timelapse or video recording
 * @param  {Number} mode Sensor pin mode value
 * @return {Object} instance
 */
RaspiCam.prototype.start = function( ) {

  if(PROCESS_RUNNING_FLAG){
    return false;
  }


  // build the arguments
  var args = [];

  for(var opt in this.args){
    if(opt !== "mode" && opt !== "log"){
      args.push("--" + opt);
      //don't add value for true flags
      if( this.args[opt].toString() !== "true" && this.args[opt].toString() !== "false"){
        args.push(this.args[opt].toString());
      }
    }
  }

  var cmd;

  let opts = {};
  switch(this.args.mode){
    case 'photo':
      this.watchDirectory();
      cmd = PHOTO_CMD;
      break;
    case 'timelapse':
      cmd = TIMELAPSE_CMD;

      // if no timelapse frequency provided, return false
      if(typeof this.args.timelapse === "undefined"){
        this.emit("start", "Error: must specify timelapse frequency option", new Date().getTime() );
        return false;
      }
      // if not timeout provided, set to longest possible
      if(typeof this.args.timeout === "undefined"){
        this.args.timeout = INFINITY_MS;
      }
      break;
    case 'video':
      cmd = VIDEO_CMD;
      opts = { stdio: ['ignore', 'pipe', 'inherit'] };
      break;
    default:
      this.emit("start", "Error: mode must be photo, timelapse or video", new Date().getTime() );
      return false;
  }

  //start child process
  this.args.log('calling....');
  this.args.log(cmd + ' ' + args.join(" "));
  this.child_process = spawn(cmd, args, opts);
  child_process = this.child_process;
  PROCESS_RUNNING_FLAG = true;

  //set up listeners for stdout, stderr and process exit
  this.addChildProcessListeners();

  this.emit("start", null, new Date().getTime() );

  return true;
};

// stop the child process
// return true if process was running, false if no process to kill
RaspiCam.prototype.stop = function( ) {

  //close previous directory watcher if any
  if(this.watcher !== null){
    this.watcher.close();
  }

  if(PROCESS_RUNNING_FLAG){
    this.child_process.kill();
    child_process = null;
    PROCESS_RUNNING_FLAG = false;

    this.emit("stop", null, new Date().getTime() );
    return true;
  }else{
    this.emit("stop", "Error: no process was running", new Date().getTime());
    return false;
  }
};

/**
 *
 * addChildProcessListeners()
 *
 * Adds listeners to the child process spawned to take pictures
 * or record video (raspistill or raspivideo).
 *
 **/
RaspiCam.prototype.addChildProcessListeners = function(){
  var self = this;
  var dout, derr;

  this.child_process.stdout.on('data', function (data) {
    self.args.log('stdout: ' + data);
    dout = data;
  });

  this.child_process.stderr.on('data', function (data) {
    self.args.log('stderr: ' + data);
    derr = data;
  });

  this.child_process.on('close', function (code) {
    PROCESS_RUNNING_FLAG = false;
    self.child_process = null;
    child_process = null;

    if (self.watcher !== null) {
      self.watcher.close(); //remove the file watcher
      self.watcher = null;
    }

    //emit exit signal for process chaining over time
    self.emit("exit", new Date().getTime());
  });
};


/**
 * getter
 **/
RaspiCam.prototype.get = function(opt){
  return this.args[opt];
};


/**
 * setter
 **/
RaspiCam.prototype.set = function(opt, value){
  this.args[opt] = value;
  if(opt === "output"){
    //regenerate filepath, etc, with new output value
    this.derivativeArgs();
  }
};

module.exports = RaspiCam;
