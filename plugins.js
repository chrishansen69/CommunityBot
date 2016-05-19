// pretty much stolen from https://github.com/simonknittel/discord-bot-api
'use strict';

function loadPlugins(pluginList) {
	let plugins = {};

	for (let pluginName in pluginList) {
		if (pluginList.hasOwnProperty(pluginName)) {
			plugins[pluginName] = require('plugins/' + pluginName);
		}
	}
	
	return plugins;
}
module.exports = loadPlugins;