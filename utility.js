'use strict';

/** utility constants */
const RUNNING_ON_OPENSHIFT = exports.RUNNING_ON_OPENSHIFT = process.env.OPENSHIFT_APP_NAME !== undefined;
const dataFolder = exports.dataFolder = RUNNING_ON_OPENSHIFT ? './../../data/' : './data/'; // there's an extra folder to go back, /runtime/

const jsonfile = require('./lib/jsonfile.js');
const fs = require('fs');

/**
 * Load a file into the require cache, copying it from a default file if it doesn't exist
 * 
 * @param  {String} file the file to require
 * @param  {String} defFile the default file to copy from
 * @return {void}
 */
function attemptRequire(file, defFile) {
  try {
    require(file);
  } catch (e) {
    console.error(e);

    console.log(file + ' not found. Copying from ' + defFile);

    fs.writeFileSync(file, fs.readFileSync(defFile));
  }
}

/// Create config.json if not exists
attemptRequire('./data/config.json', RUNNING_ON_OPENSHIFT ? './data/config-my-base.json' : './data/config-base.json');

/// Create ops.json if not exists
attemptRequire(dataFolder + 'ops.json', './data/ops.json');

/// Create xdata.json if not exists
attemptRequire(dataFolder + 'xdata.json', './data/xdata-base.json');

const permissions = require('./permissions.js');

/** @type {Object<?>} an object containing persistent data */
exports.xdata = require(dataFolder + 'xdata.json');
/** @type {Object<?>} an object containing non-persistent, hand-crafted settings */
exports.config = require('./data/config.json');

/**
 * {Object<Function>} registered bot commands
 */
const commands = exports.commands = {};

exports.replies = require('./data/replies.json');
exports.memeText = require('./data/memeText.json');
exports.memeFiles = require('./data/memeFiles.json');
// this goes unused
//const commandDescriptions = exports.commandDescriptions = {}; // this is not save

/** @type {Object} For storing server-local data that doesn't persist */
const pseudoServers = {};
/** @type {Object} For storing channel-local data that doesn't persist */
const pseudoChannels = {};

exports.getPseudoServers = function() {
  return pseudoServers;
};

exports.getPseudoChannels = function() {
  return pseudoChannels;
};

exports.getPseudoServer = function(s) {
  if (!pseudoServers[s.id]) {
    pseudoServers[s.id] = {};
  }
  return pseudoServers[s.id];
};

exports.getPseudoChannel = function(s) {
  if (!pseudoChannels[s.id]) {
    pseudoChannels[s.id] = {};
  }
  return pseudoChannels[s.id];
};

/**
 * registers a bot command
 * 
 * cmd: the command trigger (String)
 * action: the command function(function)
 */
exports.registerCommand = function(cmd, action, description) {
  commands[cmd] = action;
  //commandDescriptions[cmd] = description || '*No description available.*';
};

/**
 * registers multiple bot commands
 * 
 * cmds: the command triggers (String[])
 * actions: the command functions (function[])
 */
exports.registerCommands = function(cmds, actions, descriptions) {
  if (descriptions) {
    for (const i in actions) {
      commands[cmds[i]] = actions[i];
      //commandDescriptions[cmds[i]] = descriptions[i];
    }
  } else {
    for (const i in actions) {
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
  commands[cmd] = new Function('message', 'suffix', 'bot', 'print', 'file', execute);
  //commandDescriptions[cmd] = 'User-created command';
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
 * saves persistent data
 */
exports.saveXData = function() {
  jsonfile.writeFileSync(dataFolder + 'xdata.json', exports.xdata, {spaces: 2});
};
/**
 * sets the config object (you don't need to use this unless you've changed the object reference by, for example, parsing it again)
 */
exports.setConfig = function(_conf) {
  exports.config = _conf;
};
/**
 * saves the config object to disk (not really useful since it will be overriden after a git update)
 */
exports.saveConfig = function() {
  jsonfile.writeFileSync('./data/config.json', exports.config, {spaces: 2});
};