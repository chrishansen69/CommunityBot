// Battler compatibility polyfills

var win32ole = require('win32ole');
function w32Factory(s) {
	return win32ole.client.Dispatch(s);
}