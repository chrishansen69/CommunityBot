'use strict';

// Discord Bot API
const bot = require('../../bot.js');
const perms = require('../../permissions.js');
const roles = require('../../roles.js');

module.exports = {
  name: 'bare-minimum',
  defaultCommandPrefix: 'bare-minimum',
  commands: {
    'prunebots': {
      fn: function(message, suffix) {
        message.channel.fetchMessages({before: message, limit: 200}).then(messages => {
          const amessages = [];
          messages = messages.array();

          messages.forEach(function(v) {
            if (v.author.bot || v.author.username === 'BonziBuddy' || v.content[0] == '=')
              amessages.push(v);
          });

          let numDeletedMsgs = 0;
          function checkFinished() {
            numDeletedMsgs++;
            if (numDeletedMsgs == amessages.length)
              message.channel.sendMessage('Pruned last ' + parseInt(suffix) + ' messages.');
          }

          for (let i = 0; i < amessages.length; i++) {
            bot.deleteMessage(amessages[i], {}, checkFinished);
          }

        }).catch((err) => {
          console.error(err);
          message.channel.sendMessage('Failed to prune bot messages in this channel: `' + err + '`');
        });
      },
      description: 'Prune bot messages in this channel.'
    },
    'prunespam': {
      fn: function(message, suffix) {
        if (!perms.has(message, 'minimod')) return;
        
        message.channel.fetchMessages({before: message, limit: 50}).then(messages => {
          const amessages = [];

          messages.forEach(function(v) {
            if (v.content.length <= 3 || v.content[0] === '=' || v.content[0] === '?' || v.content[0] === '´' || v.content[0] === '.' || v.content[0] === '!')
              amessages.push(v);
          });

          let numDeletedMsgs = 0;
          function checkFinished() {
            numDeletedMsgs++;
            if (numDeletedMsgs == amessages.length)
              message.channel.sendMessage('Pruned last ' + parseInt(suffix) + ' messages.');
          }

          for (let i = 0; i < amessages.length; i++) {
            bot.deleteMessage(amessages[i], {}, checkFinished);
          }

        }).catch((err) => {
          console.error(err);
          message.channel.sendMessage('Failed to prune bot messages in this channel: `' + err + '`');
        });
      },
      description: 'Prune spam (very short/command call) messages in this channel.'
    },
    'prune': {
      fn: function(message, suffix) {
        if (!perms.has(message, 'minimod')) return;

        message.channel.fetchMessages({before: message, limit: parseInt(suffix)}).then(messages => {
          let numDeletedMsgs = 0;
          function checkFinished() {
            numDeletedMsgs++;
            if (numDeletedMsgs == messages.length)
              message.channel.sendMessage('Pruned last ' + parseInt(suffix) + ' messages.');
          }

          for (let i = 0; i < messages.length; i++) {
            bot.deleteMessage(messages[i], {}, checkFinished);
          }

          bot.deleteMessage(message);

        }).catch((err) => {
          console.error(err);
          message.channel.sendMessage('Failed to prune bot messages in this channel: `' + err + '`');
        });
      },
      description: 'Prune a certain amount of messages in this channel. (Requires \'Manage messages\' permission)'
    },
    'rename': {
      fn: function(message, suffix) {
        if (!perms.has(message, 'globalmod')) return;
        
        if (message.mentions.length > 0) {
          message.mentions.forEach(function(el) {
            roles.editNickname({
              userID: el.id, 
              serverID: message.channel.guild.id,
              nick: suffix.substr(suffix.indexOf(' | ') + 3)
            }, function(e) {
              if (e) {
                message.channel.sendMessage('Error: ' + JSON.stringify(e));
                console.log('Failed with userID ' + el.id);
                console.log('serverID ' + message.channel.guild.id);
                console.log('nick ' + suffix.substr(suffix.indexOf(' | ') + 3));
                console.log('token ' + bot.internal.token);
                console.error(e);
              }
            });
          });
        }
      },
      description: 'Rename a user in a server.'
    },
  },
};