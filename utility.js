"use strict";

const bot = require('./bot.js');
let ops = require('./ops.json');

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
    jsonfile.writeFileSync('./ops.json', ops, {spaces: 2});
    return true;
  },
  deop: function(opped) {
    const index = ops.indexOf(opped.id);
    if (index !== -1) {
      ops.splice(index, 1);
      jsonfile.writeFileSync('./ops.json', ops, {spaces: 2});
      return true;
    }
    
    bot.sendMessage(message.channel, opped.name + ' is not an operator');
    return false;
  }
};