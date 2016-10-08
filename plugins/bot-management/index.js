'use strict';

// Discord Bot API
const bot = require('../../bot.js');
const perms = require('../../permissions.js');
const utility = require('../../utility.js');

const jsonfile = require('../../lib/jsonfile.js');
const chalk = require('chalk');
const request = require('request');
const fs = require('fs');

/** @type {Object} used by =eval to store things. */
// jshint ignore:start
const eval_stuff = {}; // eslint-disable-line no-unused-vars
// jshint ignore:end

module.exports = {
  name: 'bot-management',
  defaultCommandPrefix: 'bot-management',
  commands: {
    // Bot management
    'setgame': {
      fn: function(msg, suffix) {
        if (!perms.has(msg, 'op')) return;
        
        bot.user.setStatus('online', suffix).then(() => msg.channel.sendMessage('Done! Now playing: ' + suffix)).catch(err => {
          msg.channel.sendMessage('It failed: ```' + err + '```');
        });
      },
      synonyms: [
        'game', 'playing', 'nowplaying'
      ],
      description: 'Sets the game the bot is currently playing.'
    },
    'setgame-idle': {
      fn: function(msg, suffix) {
        if (!perms.has(msg, 'op')) return;
        
        bot.user.setStatus('idle', suffix).then(() => msg.channel.sendMessage('Done! Now playing: ' + suffix + 'Idle!')).catch(err => {
          msg.channel.sendMessage('It failed: ```' + err + '```');
        });

      },
      description: 'Sets the game the bot is currently playing and sets the bot\'s status to Idle.'
    },
    'join': {
      fn: function(message, suffix) {
        message.channel.sendMessage('I can\'t accept invites, please go to my oAuth 2 link at ' + utility.config.oauthlink);
      },
      description: 'Join a server through an invite link.'
    },
    'setavatar': {
      fn: function(message, suffix) {
        if (!perms.has(message, 'op')) return;
        
        const config = utility.config;
        const path = suffix.split(' ')[0];
        
        if (path.length < 1) {
            message.channel.sendMessage('You have to add a relative path or an url to the new avatar.');
            return;
        }
        
        const oldAvatar = config.avatar;
        config.avatar = path;

        jsonfile.writeFile('./data/config.json', config, {spaces: 2}, function(err) {
          if (err) { // if failed
            console.error(err);
            config.avatar = oldAvatar;
            message.channel.sendMessage('There was an error saving the avatar to your \'config.json\'.');
            return;
          }
          
          const reg = new RegExp(/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/, 'gi');
          if (reg.test(path)) { // if is URL
            request({
              url: path,
              encoding: null,
            }, function(error, response, body) {
              if (!error && response.statusCode == 200) {
                bot.updateDetails({avatar: new Buffer(body).toString('base64') });
              } else {
                console.log(chalk.red('The avatar could not be set. Make sure the path is correct.'));
              }
            });
          } else { // else, assume absolute file path
            bot.updateDetails({avatar: fs.readFileSync(path, 'base64') });
          }
        });
      },
      description: 'Sets the bot\'s avatar.'
    },
    'op': {
      fn: function(message, suffix) {
        if (!perms.has(message, 'op')) return;
        if (!suffix) { message.channel.sendMessage('Mention someone to op them'); return; }
        
        let opped;
        if (message.mentions.users.size > 0) { // get by mention
          opped = message.mentionsArr[0];
        } else { // get by name
          const name = suffix.split(' ')[0];
          
          opped = message.channel.guild.members.get('name', name);
          if (!opped || !opped.username) {
            message.channel.sendMessage('Could not find user ' + name + '!');
            return;
          }
        }
        
        if (!utility.op(opped))
          message.channel.sendMessage(opped.toString() + ' is already an operator');
        else
          message.channel.sendMessage('Opped user ' + opped.toString());
      },
      description: 'Gives an user Operator rights. Only bot operators can use this command.'
    },
    'deop': {
      fn: function(message, suffix) {
        if (!perms.has(message, 'op')) return;
        if (!suffix) { message.channel.sendMessage('Mention someone to deop them'); return; }
        
        let opped;
        if (message.mentions.users.size > 0) { // get by mention
          opped = message.mentionsArr[0];
        } else { // get by name
          const name = suffix.split(' ')[0];
          
          opped = message.channel.guild.members.get('name', name);
          if (!opped || !opped.username) {
            message.channel.sendMessage('Could not find user ' + name + '!');
            return;
          }
        }
        
        if (utility.deop(opped))
          message.channel.sendMessage('De-opped user ' + opped.username);
        else
          message.channel.sendMessage(opped.username + ' is not an operator');
      },
      description: 'Takes an user\'s Operator rights. Only bot operators can use this command.'
    },
    'kill': {
      fn: function(message) {
        if (!perms.has(message, 'op')) return;
        
        bot.destroy();

        console.log(chalk.yellow('The bot was stopped through the kill command.'));
        console.log(''); // Empty line
        process.exit();
      },
      synonyms: [
        'exit'
      ],
      description: 'Shuts down the bot. Bot operators only!'
    },
    'botpermissions': {
      fn: function(message) {
        if (!perms.has(message, 'op')) return;

        const allperms = [
          'CREATE_INSTANT_INVITE',
          'KICK_MEMBERS',
          'BAN_MEMBERS',
          'ADMINISTRATOR',
          'MANAGE_CHANNELS',
          'MANAGE_GUILD',
          'READ_MESSAGES',
          'SEND_MESSAGES',
          'SEND_TTS_MESSAGES',
          'MANAGE_MESSAGES',
          'EMBED_LINKS',
          'ATTACH_FILES',
          'READ_MESSAGE_HISTORY',
          'MENTION_EVERYONE',
          'EXTERNAL_EMOJIS', // use external emojis
          'CONNECT', // connect to voice
          'SPEAK', // speak on voice
          'MUTE_MEMBERS', // globally mute members on voice
          'DEAFEN_MEMBERS', // globally deafen members on voice
          'MOVE_MEMBERS', // move member's voice channels
          'USE_VAD', // use voice activity detection
          'CHANGE_NICKNAME',
          'MANAGE_NICKNAMES', // change nicknames of others
          'MANAGE_ROLES_OR_PERMISSIONS'
        ];
        const tperms = message.channel.permissionsFor(bot.user).serialize();
        for (let i = 0; i < allperms.length; i++) {
          if (!tperms[allperms[i]]) {
            tperms[allperms[i]] = false;
          }
        }
        message.channel.sendMessage(JSON.stringify(tperms, null, 2).trim());
      },
      description: 'Shows you the bot\'s permissions, for testing purposes.'
    },
    'permtest': {
      fn: function(message) {
        if (!perms.has(message, 'op')) return;

        if (message.channel.permissionsFor(message.author).hasPermission('KICK_MEMBERS')) {
            message.channel.sendMessage(':warning: ' + message.author.username + ' has permission to kick users');
        } else {
            message.channel.sendMessage(':warning: ' + message.author.username + ' does **not** have permission to kick users');
        }
      },
      description: 'This space intentionally left blank.'
    },
    // Command creation
    'eval': {
      /*jslint evil: true */
      fn: function(message, suffix) {
        if (!perms.has(message, 'op')) return;
        
        try {
          message.channel.sendMessage(eval(suffix));
        } catch (err) {
          const array = [];
          array.push('*Eval failed.*');
          array.push('```');
          array.push(err);
          array.push(err.stack);
          array.push('```');
          message.channel.sendMessage(array);
        }
      },
      synonyms: [
        'exec'
      ],
      description: 'Runs a script. Bot operators only.'
    },
    'stress': {
      /*jslint evil: true */
      fn: function(message, suffix, bot, utility_cmd_print, utility_cmd_file) {
        if (!perms.has(message, 'op')) return;
        const c = utility.commands;
        Object.keys(c).forEach(function(v) {
          if (v == 'kill' || v == 'exit' || v == 'stress') return;
          console.log('trying ' + v);
          c[v](message, suffix, bot, utility_cmd_print, utility_cmd_file);
        });
      },
      description: 'Does dangerous things. Bot operators only.'
    },
    'createcmd': {
      fn: function(message, suffix) {
        if (!perms.has(message, 'op')) return;
        
        const index = suffix.indexOf(' | ');
        if (index !== -1) {
            try {
              const xdata = utility.xdata;
              
              // register command
              const cmd = suffix.substr(0, index);
              const execute = suffix.substr(index + 3);
              utility.registerEval(cmd, execute);
              
              // store to xdata
              
              // get index to replace if exists
              let overwrote = false;
              let exindex = xdata.customCommands.length;
              for (let i = 0; i < xdata.customCommands.length; i++) { // forEach faster in chrome v8 but can't `break;`
                if (xdata.customCommands[i].name === cmd) {
                  exindex = i;
                  overwrote = true;
                  break;
                }
              }
              
              xdata.customCommands[exindex] = {name: cmd, action: execute};
              utility.saveXData();
              
              // done
              if (!overwrote) {
                message.channel.sendMessage('Registered ' + cmd + ' with snippet ' + execute);
              } else {
                message.channel.sendMessage('Overwrote ' + cmd + ' with snippet ' + execute);
              }
              
            } catch (e) {
              message.channel.sendMessage('Error registering command: ' + e);
            }
        } else {
            message.channel.sendMessage('Invalid syntax');
        }
      },
      description: 'Creates a command. Bot operators only.'
    },
    'echo': {
      fn: function(message, suffix) {
        if (!perms.has(message, 'op')) return;

        message.channel.sendMessage(suffix);
      },
      description: 'Echoes a message. Bot operators only.'
    },
    'memusage': {
      fn: function(message) {
        const memUsage = process.memoryUsage();
        message.channel.sendMessage([
          'Resident Set Size: ' +  (memUsage.rss / 1048576) + 'mb', 
          ' - Total Heap Size: ' + (memUsage.heapTotal / 1048576) + 'mb',
          ' - Used Heap Size: ' +  (memUsage.heapUsed / 1048576) + 'mb',
          'Bot has 512MB RAM total from a free gear in OpenShift',
          'For info: http://i.imgur.com/eGt6I6o.png'
        ]);
      },
      description: 'Display bot memory usage. For debugging purposes.'
    },
  },
};