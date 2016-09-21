var fs = require('fs');

var dir;
var pattern;

// TODO: Support more operating systems.
if (process.platform == 'darwin') {
  dir = '/dev/';
  pattern = /cu.usbmodem\w+/;
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

  var items = fs.readdirSync(dir);

  for (var i = 0; i < items.length; i++) {
    if (items[i].match(pattern)) {
      candidates.push(dir + items[i]);
    }
  }

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
