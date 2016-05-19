'use strict';

const Discord = require('discord.js');
const fs = require('fs');

try {
	require('./config.json');
} catch (e) {
	console.log("config.json not found. Copying from config-base.json...");
	fs.writeFileSync('./config.json', fs.readFileSync('./config-base.json'));
}
const config = require('./config.json');

const trigger = config.trigger;

let bot = new Discord.Client();
module.exports = bot;

let commands = require('./cmd.js').commands;

bot.on("ready", function () {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels.");
});

bot.on("disconnected", function () {
	console.log("Bot has disconnected. Exiting...");
	process.exit(0); //exit node.js without an error cuz CI will complain if we don't use valid credentials
});

bot.on("error", function (error) {
	console.log("Caught error: " + error);
});

bot.on("message", function (message) {
	let msg = message.content;
	if (msg[0] === trigger) {
		let command = msg.toLowerCase().split(" ")[0].substring(1);
		let suffix = msg.substring(command.length + 2);
		if (commands[command]) commands[command].process(message, suffix);
	}
});

const plugins = require('./plugins.js');
if (config.plugins && config.plugins.length > 0) {
	plugins(config.plugins);
}

bot.login(config.email, config.password);