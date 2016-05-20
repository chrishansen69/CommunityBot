"use strict";

const bot = require('./bot.js');
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
	 * returns registered bot commands
	 */
	getCommands: function() {
		return commands;
	}
};