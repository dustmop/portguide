# portguide

A heuristical approach to guess the portname for a usb connected microcontroller.

For example, connect your Arduino or Tessel, then instead of figuring out your portname manually, do the following:

```
var portguide = require('portguide');
var SerialPort = require('serialport');
var port = new SerialPort(portguide.findPort(), {
  baudRate: 9600
});
....
```

No need to worry about plugging your device into the wrong usb port, portguide has got you covered!

Supports Linux, OSX, and Windows.

# install

```
npm install portguide
```

# caveats

Portguide's operation is not terribly intelligent. It simply looks for a device with a familiar naming pattern, but doesn't verify that the connection will actually work. Furthermore, if more than one device is attached, portguide will decline to pick one; instead it will just fail.

Probably not suitable for production, but great for experimentation, demos, or just showing off!
