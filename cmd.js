'use strict';
// TODO:
// - Permissions - DONE
// - More evalwhitelist.json stuff - DONE
// - Command descriptions - PARTLY DONE
// - Save setgame output



const bot = require('./bot.js');
const utility = require('./utility.js');
const getConfig = utility.getConfig;
const perms = require('./permissions.js');

const fs = require('fs');

/*
 * Performance test:
 * 
 * function fa(msg) {
 *   msg.match(/.{1,3}/g);
 * }
 * function fb(s) {
 *   var a = [];
 *   var i = 3;
 *   do {
 *       a.push(s.substring(0, i));
 *   } while((s = s.substring(i, s.length)) != "");
 * }
 * 
 * var msg = "The quick brown fox jumps over the lazy dog"
 * var iterations = 1000000;
 * 
 * console.time('Regex');
 * for(let i = 0; i < iterations; i++){
 *     fa(msg);
 * };
 * var timea = console.timeEnd('Regex');
 * 
 * 
 * console.time('Array');
 * for(let i = 0; i < iterations; i++){
 *     fb(msg);
 * };
 * var timeb = console.timeEnd('Array');
 * 
 * console.log('Regex: avg ' + ((timea / iterations) * 1000000) + ' ns');
 * console.log('Array: avg ' + ((timeb / iterations) * 1000000) + ' ns');
 *
 * Regex: 4567.56ms (1000000 iterations)
 * Array: 2766.93ms (1000000 iterations)
 * Regex: avg 4567.559999999998 ns
 * Array: avg 2766.930000000022 ns
 *
 * Conclusion: Meaningless difference.
 */
/**
 * Split a message into blocks of 1900 chars and send it to a channel
 * 
 * @param  {Channel} channel
 * @param  {Message} msg
 */
function sendSplitMessage(channel, msg) {
  const a = msg.match(/.{1,1900}/g);
  for (let b = 0, c = a.length; b < c; b++)
    channel.sendMessage(a[b]);
}

process.on('exit', function() { // save r9kMessages (and possibly other settings) on exit
  utility.saveConfig();
  utility.saveXData();
});

exports.r9kEnabled = function(channel) {
  return getConfig().r9kEnabled[channel.id];
};

exports.r9k = function(msg) { // r9k mode
  const xdata = utility.getXData();
  const id = msg.channel.id; // unique-ish channel id
  console.info(xdata.r9kMessages);
  
  if (xdata.r9kMessages[id].indexOf(msg.cleanContent.trim()) !== -1) { // if message is not unique
    console.log('deleting ' + msg.content);
    bot.deleteMessage(msg);
  } else { // if message is unique, add it to the xdata
    console.log('adding ' + msg.content);
    xdata.r9kMessages[id][xdata.r9kMessages[id].length] = msg.cleanContent.trim();
  }
};

exports.commands = {
  'r9k': {
    process: function(message, suffix) {
      if (!perms.has(message, 'mod')) return;
      
      const id = message.channel.id; // unique-ish channel id
      const config = getConfig();
      const xdata = utility.getXData();
      
      if (!xdata.r9kMessages[id]) // make channel slot if not exists
        xdata.r9kMessages[id] = [];
      
      if (suffix == 'on' && !config.r9kEnabled[id]) { //enable
        config.r9kEnabled[id] = true;
        message.channel.sendMessage('Enabled R9K mode');
      } else if (suffix == 'off' && config.r9kEnabled[id]) { //disable
        config.r9kEnabled[id] = false;
        message.channel.sendMessage('Disabled R9K mode');
      } else { //toggle
        config.r9kEnabled[id] = !config.r9kEnabled[id];
        message.channel.sendMessage((config.r9kEnabled[id] ? 'Enabled' : 'Disabled') + ' R9K mode');
      }
    }
  },
  'getconf': {
    process: function(message) {
      if (message.author.id !== '170382670713323520') return; // ONLY rafa1231518 can use this command
      
      try {
        message.channel.sendMessage('```' + JSON.stringify(getConfig()) + '```');
        console.log(JSON.stringify(getConfig()));
      } catch (e) {
        console.error(e);
        message.channel.sendMessage('It failed: ' + e);
      }
    }
  },
  'getxdata': {
    process: function(message) {
      if (message.author.id !== '170382670713323520') return; // ONLY rafa1231518 can use this command
      
      try {

        sendSplitMessage(message.channel, JSON.stringify(utility.getXData()));

      } catch (e) {
        console.error(e);
        message.channel.sendMessage('It failed: ' + e);
      }
    }
  },
  'setconf': {
    process: function(message) {
      if (message.author.id !== '170382670713323520') return; // ONLY rafa1231518 can use this command
      
      try {
        utility.setConfig(JSON.parse(message.content.substr(message.content.indexOf(' ') + 1)));
        utility.saveConfig();
        message.channel.sendMessage('Successfully set your config');
      } catch (e) {
        console.error(e);
        message.channel.sendMessage('It failed: ' + e);
        message.channel.sendMessage('Your message: ' + message.content.substr(message.content.indexOf(' ') + 1));
      }
    }
  },
  'saveconf': {
    process: function(message) {
      if (message.author.id !== '170382670713323520') return; // ONLY rafa1231518 can use this command
      
      try {
        utility.saveConfig();
        utility.saveXData();
        message.channel.sendMessage('Successfully saved your config');
      } catch (e) {
        console.error(e);
        message.channel.sendMessage('It failed: ' + e);
      }
    }
  },
  'resetconf': { // remember to getconf and save it before this!
    process: function(message) {
      if (message.author.id !== '170382670713323520') return; // ONLY rafa1231518 can use this command
      
      try {
        console.log('resetting config.json...');
        fs.writeFileSync('./config.json', fs.readFileSync('./config-my-base.json'));
        delete require.cache['./config.json'];
        utility.setConfig(require('./config.json'));
        console.log('resaving config.json...');
        utility.saveConfig();
        
        message.channel.sendMessage('Reset config.json to config-my-base original...');
      } catch (e) {
        console.error(e);
        message.channel.sendMessage('It failed: ' + e);
      }
    }
  },
  'rips1': { // SPAMBOT
    process: function(message) {
      if (!perms.has(message, 'op')) return;
      
      setInterval(function() { message.channel.sendMessage('FUCK BEES'); }, 1000); setInterval(function() { message.channel.sendMessage('IT\'S HIP'); }, 500); setInterval(function() { message.channel.sendMessage('CHECK EM'); }, 700);
    }
  },
  'rips2': { // SPAMBOT
    process: function(message) {
      if (!perms.has(message, 'op')) return;
      
      setInterval(function() { message.channel.sendMessage('?xp'); }, 1000);
    }
  },
  'rips3': { // SPAMBOT
    process: function(message) {
      if (!perms.has(message, 'op')) return;
      
      setInterval(function() { message.channel.sendMessage('' + Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36)); }, 1000);
    }
  },
};

// alias commands
//exports.commands.exec = exports.commands.eval;
//exports.commands.game = exports.commands.setgame;
//exports.commands.exit = exports.commands.kill;