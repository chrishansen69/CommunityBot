"use strict";

// warning OpenShift does NOT support longjohn because it (longjohn) doesn't support strict mode (due to arguments.callee)
//if (process.env.NODE_ENV !== 'production'){
//  require('longjohn');
//}

const Discord = require('discord.js');
const utility = require('./utility.js');

// LOAD CONFIG

const getConfig = utility.getConfig;
const getXData = utility.getXData;
const trigger = getConfig().trigger;

// INITIALIZE BOT

let bot = module.exports = new Discord.Client({autoReconnect: true});

// ADD HANDLERS

const roles = require('./roles.js');

const cmds = require('./cmd.js');
const commands = cmds.commands;

bot.on("ready", function() {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels.");
});

bot.on("disconnected", function() {
	console.log("Bot has disconnected. Retrying...");
  
  // FIXME is it not reconnecting?
  
	//process.exit(0); //exit node.js without an error cuz CI will complain if we don't use valid credentials
});

bot.on("error", function(error) {
	console.log("Caught error: " + error);
});

bot.on("message", function(message) { // MAIN MESSAGE HANDLER
  if (cmds.r9kEnabled(message.channel)) { // r9k mode (deletes non-unique messages)
    cmds.r9k(message);
  }
  
	let msg = message.content;
	if (msg[0] === trigger) {
		let command = msg.toLowerCase().split(" ")[0].substring(1);
		let suffix = msg.substring(command.length + 2);
		if (commands[command]) { // original commands
			commands[command].process(message, suffix);
		} else if (utility.getCommands()[command]) { // custom commands registered through utility.js
			console.log('found ' + command);
      utility.getCommands()[command](message, suffix, bot); //bot is last, for cleans
		}
	}
});

const loadPlugins = require('./plugins.js');
if (getConfig().plugins && getConfig().plugins.length > 0) {
	const plugins = loadPlugins(getConfig().plugins);
  
  
  Object.keys(plugins).forEach(function(i) {
    const plugin = plugins[i];
    
    Object.keys(plugin.commands).forEach(function(name) {
      const command = plugin.commands[name];
      
      utility.registerCommand(name, command.fn, command.description); // register
      console.log("registered: " + name);
      if (command.synonyms) {
        command.synonyms.forEach(function(aliasName) {
          utility.registerCommand(aliasName, command.fn); // register
          console.log("registered alias: " + aliasName);
        });
      }
    });
  });
}
// load user commands from saved
if (getXData().customCommands) {
	for (let i of getXData().customCommands) {
		utility.registerEval(i.name, i.action);
	}
}

function initRoles() {
  roles.initialize();
}

if (getConfig().token)
  bot.loginWithToken(getConfig().token).then(initRoles); // login with token
else
  bot.login(getConfig().email, getConfig().password).then(initRoles); // login with regular email/password
