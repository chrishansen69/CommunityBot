'use strict';

// warning OpenShift does NOT support longjohn because it (longjohn) doesn't support strict mode (due to arguments.callee)
//if (process.env.NODE_ENV !== 'production'){
//  require('longjohn');
//}

const Discord = require('discord.js');

// INITIALIZE BOT

const bot = module.exports = new Discord.Client();
// legacy methods
bot.sendMessage = function(ch, msg) {
  ch.sendMessage(msg);
};
bot.sendFile = function(ch, att, n, con, callback) {
  ch.sendFile(att, n, con).then(callback);
};

// LOAD CONFIG

const utility = require('./utility.js');

const getConfig = utility.getConfig;
const getXData = utility.getXData;
const trigger = getConfig().trigger;

// ADD HANDLERS

const roles = require('./roles.js');

const cmds = require('./cmd.js');
const commands = cmds.commands;

bot.once('ready', () => {
  console.log('Ready to begin! Serving in ' + bot.channels.size + ' channels.');
});
bot.on('reconnecting', () => {
  console.log('Bot has disconnected. Retrying...');
    
  if (process.env.CI)
    process.exit(0); //exit node.js without an error cuz CI will complain if we don't use valid credentials
});

bot.on('error', error => {
  console.log('Caught error: ' + error);
});

/**
 * utility command to print to chat
 * 
 * @param  {Channel} chan
 * @param  {String} str
 */
function utility_cmd_print(chan, str) {
  chan.sendMessage(str);
}
/**
 * utility command to send file to chat
 * 
 * @param  {Channel} chan
 * @param  {String} str
 */
function utility_cmd_file(chan, str) {
  chan.sendFile(str);
}

bot.on('message', function(message) { // MAIN MESSAGE HANDLER
  if (cmds.r9kEnabled(message.channel)) { // r9k mode (deletes non-unique messages)
    cmds.r9k(message);
  }

  if (message.channel.isPrivate && (message.content.indexOf('discord.gg') > -1 || message.content.indexOf('discordapp.com') > -1)) {

    const config = getConfig();
    message.channel.sendMessage('I can\'t accept invites, please go to my oAuth 2 link at ' + config.oauthlink);

    return;
  }
  
  const msg = message.content;
  if (msg[0] === trigger) {
    const command = msg.toLowerCase().split(' ')[0].substring(1);
    const suffix = msg.substring(command.length + 2);
    if (commands[command]) { // original commands
      commands[command].process(message, suffix);
    } else if (utility.getCommands()[command]) { // custom commands registered through utility.js
      console.log('found ' + command);
      utility.getCommands()[command](message, suffix, bot, utility_cmd_print, utility_cmd_file); //bot is last, for cleans. unused params are ignored
    }
  }
});

bot.on('guildBanAdd', (server, user) => {
  server.general.sendMessage(user.toString() + ' has been banned from this server.');
});

bot.on('guildBanRemove', (server, user) => {
  server.general.sendMessage(user.toString() + ' has been unbanned.');
});

bot.on('guildMemberAdd', (server, user) => {
  server.general.sendMessage(user.toString() + ' has joined the server. Welcome!');
});

bot.on('guildMemberRemove', (server, user) => {
  server.general.sendMessage(user.toString() + ' has left (or was kicked) from this server.');
});

const loadPlugins = require('./plugins.js');
if (getConfig().plugins && getConfig().plugins.length > 0) {
  const plugins = loadPlugins(getConfig().plugins);
  
  Object.keys(plugins).forEach(function(i) {
    const plugin = plugins[i];
    
    Object.keys(plugin.commands).forEach(function(name) {
      const command = plugin.commands[name];
      
      utility.registerCommand(name, command.fn, command.description); // register
      console.log('registered: ' + name);
      if (command.synonyms) {
        command.synonyms.forEach(function(aliasName) {
          utility.registerCommand(aliasName, command.fn); // register
          console.log('registered alias: ' + aliasName);
        });
      }
    });
  });
}
// load user commands from saved
if (getXData().customCommands) {
  for (const i of getXData().customCommands) {
    utility.registerEval(i.name, i.action);
  }
}

function initRoles() {
  roles.initialize();
}

console.log('logging with ' + getConfig().token);
bot.login(getConfig().token).then(() => {
  console.log('logged in');
  initRoles();
}).catch(err => {
  if (process.env.CI)
    process.exit(0);
  else
    console.error(err);
}); // login with token
