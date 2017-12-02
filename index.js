var fs = require('fs');
var child_process = require('child_process');

var dir;
var pattern;
var generatorFunc;

function listDevices(collector, dir, pattern) {
  var items = fs.readdirSync(dir);
  for (var i = 0; i < items.length; i++) {
    if (items[i].match(pattern)) {
      collector.push(dir + items[i]);
    }
  }
}

function queryWinDevices(collector, dir, pattern) {
  const DEVICE_Description = 9;
  const DEVICE_DeviceID = 10;

  var cmd = 'wmic path Win32_SerialPort get /format:csv';
  var stdout = child_process.execSync(cmd).toString();
  var lines = stdout.split('\n');
  for (var k = 0; k < lines.length; k++) {
    var item = lines[k].trim();
    if (item.length == 0) {
      continue;
    }
    var device = item.split(',');
    if (device[DEVICE_Description].match(pattern)) {
      collector.push(device[DEVICE_DeviceID]);
    }
  }
}

// TODO: Support more operating systems.
if (process.platform == 'darwin') {
  dir = '/dev/';
  pattern = /cu.usbmodem\w+/;
  generatorFunc = listDevices;
} else if (process.platform == 'linux') {
  dir = '/dev/';
  pattern = /ttyACM\d+/;
  generatorFunc = listDevices;
} else if (process.platform == 'win32') {
  pattern = /Arduino|Tessel/
  generatorFunc = queryWinDevices;
} else {
  console.log('Could not determine operating system!');
  process.exit(1);
}

var candidates = [];

// Look at this computer's connected devices, and make a reasonable guess as to
// which is the correct portName, returning that portname as a string.
// This call blocks.
function findPort() {
  if (candidates.length == 1) {
    return candidates[0];
  }

  generatorFunc(candidates, dir, pattern);

  if (candidates.length == 0) {
    throw 'Could not find any connected devices.';
  } else if (candidates.length > 1) {
    var msg = 'Found multiple devices, use one of these:\n';
    for (var i = 0; i < candidates.length; i++) {
      msg += candidates[i] + '\n';
    }
    throw msg;
  }

  return candidates[0];
}

exports.findPort = findPort;
