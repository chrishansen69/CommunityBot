// Battler compatibility polyfills

var win32ole = require('win32ole');
global.w32Factory = function(s) {
	return win32ole.client.Dispatch(s);
}