'use strict';
// pretty much stolen from https://github.com/simonknittel/discord-bot-api


const utility = require('./utility.js');

function loadPlugins(pluginList) {
  const plugins = {};

  for (const pluginName of pluginList) {
    if (pluginName === 'music-bot' && utility.RUNNING_ON_OPENSHIFT) {
      console.log('music-bot is unsupported in OpenShift');
      continue;
    }
    
    const hd = process.memoryUsage().heapUsed;
    plugins[pluginName] = require('./plugins/' + pluginName);
    const bd = process.memoryUsage().heapUsed;

    console.log('loaded plugin ' + pluginName);
    console.log('memory change: ' + ((bd - hd) / 1024) + 'kb');
  }
  
  return plugins;
}
module.exports = loadPlugins;