"use strict";

/** utility constants */
const RUNNING_ON_OPENSHIFT = exports.RUNNING_ON_OPENSHIFT = process.env.OPENSHIFT_APP_NAME !== undefined;
const dataFolder = exports.dataFolder = RUNNING_ON_OPENSHIFT ? './../../data/' : './'; // there's an extra folder to go back, /runtime/

const jsonfile = require('jsonfile');
const fs = require('fs');

/// Create config.json if not exists
try {
  require('./config.json');
} catch (e) {
  console.error(e);
  
  console.log("config.json not found. Copying from config-my-base.json...");
  //fs.unlinkSync('./config.json');
  fs.writeFileSync('./config.json', RUNNING_ON_OPENSHIFT ? fs.readFileSync('./config-my-base.json') : fs.readFileSync('./config-base.json'));
}

/// Create ops.json if not exists
try {
  require(dataFolder + 'ops.json');
} catch (e) {
  console.error(e);
  
  console.log("ops.json not found. Copying from existing one...");
  //fs.unlinkSync(dataFolder + 'ops.json');
  fs.writeFileSync(dataFolder + 'ops.json', fs.readFileSync('./ops.json'));
}

/// Create xdata.json if not exists
try {
  require(dataFolder + 'xdata.json');
} catch (e) {
  console.error(e);
  
  console.log("xdata.json not found. Copying from xdata-base.json...");
  //fs.unlinkSync(dataFolder + 'xdata.json');
  fs.writeFileSync(dataFolder + 'xdata.json', fs.readFileSync('./xdata-base.json'));
}

const permissions = require('./permissions.js');

let xdata = require(dataFolder + 'xdata.json'); // TODO replace r9k, lastfm and custom commands config with xdata
let config = require('./config.json');

let commands = {};
let commandDescriptions = {}; // this is not saved

/**
 * registers a bot command
 * 
 * cmd: the command trigger (String)
 * action: the command function(function)
 */
exports.registerCommand = function(cmd, action, description) {
  commands[cmd] = action;
  commandDescriptions[cmd] = description || '*No description available.*';
};
/**
 * registers multiple bot commands
 * 
 * cmds: the command triggers (String[])
 * actions: the command functions (function[])
 */
exports.registerCommands = function(cmds, actions, descriptions) {
  if (descriptions) {
    for (let i in actions) {
      commands[cmds[i]] = actions[i];
      commandDescriptions[cmds[i]] = descriptions[i];
    }
  } else {
    for (let i in actions) {
      commands[cmds[i]] = actions[i];
    }
  }
};
/**
 * convenience method for custom chat commands
 * includes fun parameters
 * 
 * cmd: the command trigger (String)
 * execute: code to eval (String)
 */
exports.registerEval = function(cmd, execute) {
  commands[cmd] = new Function("message", "suffix", "bot", execute);
  commandDescriptions[cmd] = 'User-created command';
};
/**
 * returns registered bot commands
 */
exports.getCommands = function() {
  return commands;
};
exports.getCommandDescriptions = function() {
  return commandDescriptions;
};
/**
 * returns true if an user has operator rights
 * 
 * user: a discord.js User object
 */
exports.isOpped = function(user) {
  return permissions.hasRight(user, 'op');
};
/**
 * gives an user operator rights
 * 
 * user: a discord.js User object
 * 
 * returns false if the user is already an operator
 */
exports.op = function(user) {
  return permissions.op(user);
};
/**
 * takes operator rights from an user
 * 
 * user: a discord.js User object
 * 
 * returns false if the user is not an operator
 */
exports.deop = function(user) {
  return permissions.deop(user);
};
/**
 * get an object containing persistent data
 */
exports.getXData = function() {
  return xdata;
};
/**
 * saves persistent data
 */
exports.saveXData = function() {
  jsonfile.writeFileSync(dataFolder + 'xdata.json', xdata, {spaces: 2});
};
/**
 * get an object containing non-persistent, hand-crafted settings
 */
exports.getConfig = function() {
  return config;
};
/**
 * sets the config object (you don't need to use this unless you've changed the object reference by, for example, parsing it again)
 */
exports.setConfig = function(_conf) {
  config = _conf;
};
/**
 * saves the config object to disk (not really useful since it will be overriden after a git update)
 */
exports.saveConfig = function() {
  jsonfile.writeFileSync('./config.json', config, {spaces: 2});
};