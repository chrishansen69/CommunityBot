// Battler compatibility polyfills

//var win32ole = require('win32ole');
global.w32Factory = function(s) {
	console.log("Missing polyfill!!!");
	return null;
	//return win32ole.client.Dispatch(s);
}