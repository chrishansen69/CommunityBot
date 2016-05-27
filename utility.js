"use strict";

const RUNNING_ON_OPENSHIFT = process.env.OPENSHIFT_APP_NAME !== undefined;
const dataFolder = RUNNING_ON_OPENSHIFT ? './../../data/' : './'; // there's an extra folder to go back, /runtime/

const bot = require('./bot.js');
const jsonfile = require('jsonfile');
const chalk = require('chalk');
const fs = require('fs');

/// Create config.json if not exists
try {
	require(dataFolder + 'config.json');
} catch (e) {
	console.log("config.json not found. Copying from config-my-base.json...");
	fs.writeFileSync(dataFolder + 'config.json', fs.readFileSync(RUNNING_ON_OPENSHIFT ? './config-my-base.json' : './config-base.json'));
}

/// Create ops.json if not exists
try {
	require(dataFolder + 'ops.json');
} catch (e) {
	console.log("ops.json not found. Copying from existing one...");
	fs.writeFileSync(dataFolder + 'ops.json', RUNNING_ON_OPENSHIFT ? fs.readFileSync('./ops.json') : '[]');
}

let config = require(dataFolder + 'config.json');
let ops = require(dataFolder + 'ops.json');
 
let commands = {};

module.exports = {
	/**
	 * registers a bot command
	 * 
	 * cmd: the command trigger (String)
	 * action: the command function (function)
	 */
	registerCommand: function(cmd, action) {
		commands[cmd] = action;
	},
	/**
	 * registers multiple bot commands
	 * 
	 * cmds: the command triggers (String[])
	 * actions: the command functions (function[])
	 */
	registerCommands: function(cmds, actions) {
		for (let i in actions) {
			commands[cmds[i]] = actions[i];
		}
	},
	/**
	 * convenience method for custom chat commands
	 * includes fun parameters
	 * 
	 * cmd: the command trigger (String)
	 * execute: code to eval (String)
	 */
	registerEval: function (cmd, execute) {
		commands[cmd] = new Function("message", "suffix", "bot", execute);
	},
	/**
	 * returns registered bot commands
	 */
	getCommands: function() {
		return commands;
	},
  isOpped: function(user) {
    return ops.indexOf(user.id) !== -1;
  },
  op: function(user) {
    if (ops.indexOf(user.id) !== -1) {
      return false;
    }
    
    ops.push(user.id);
    jsonfile.writeFileSync(dataFolder + 'ops.json', ops, {spaces: 2});
    console.log(chalk.red('Opped user ' + user.name));
    return true;
  },
  deop: function(opped) {
    const index = ops.indexOf(opped.id);
    if (index !== -1) {
      ops.splice(index, 1);
      jsonfile.writeFileSync(dataFolder + 'ops.json', ops, {spaces: 2});
      console.log(chalk.red('De-opped user ' + user.name));
      return true;
    }
    
    return false;
  },
  getConfig: function() {
    return config;
  },
  setConfig: function(_conf) {
    config = _conf;
  },
  saveConfig: function() {
    jsonfile.writeFileSync(dataFolder + 'config.json', config, {spaces: 2});
  },
  RUNNING_ON_OPENSHIFT: RUNNING_ON_OPENSHIFT,
  dataFolder: dataFolder,
};