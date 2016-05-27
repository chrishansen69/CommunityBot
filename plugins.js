// pretty much stolen from https://github.com/simonknittel/discord-bot-api
'use strict';

const utility = require('./utility.js');

function loadPlugins(pluginList) {
  let plugins = {};

  for (let pluginName of pluginList) {
    if (pluginName === 'music-bot' && utility.RUNNING_ON_OPENSHIFT) {
      console.log('music-bot is unsupported in OpenShift');
      continue;
    }
    plugins[pluginName] = require('./plugins/' + pluginName);
    console.log('loaded plugin ' + pluginName);
  }
	
  return plugins;
}
module.exports = loadPlugins;