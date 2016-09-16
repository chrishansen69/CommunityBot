'use strict';

const perms = require('../../permissions.js');

const bot = require('../../bot.js');
const utility = require('../../utility.js');
const getConfig = utility.getConfig;
const nbsp = ' 👌🏻';

const confirmCodes = [];
const announceMessages = [];

/**
 * @param  {User} sender
 * @param  {String} command
 * @param  {String} usage
 */
function correctUsage(sender, command, usage) {
  sender.sendMessage('`' + getConfig().trigger + command + '` command usage: `' + usage + '`');
}

function unMute(msg, users, time, role) {
  setTimeout(() => {
    users.map((user) => {
      if (msg.channel.guild.members.get('name', user.username) && msg.channel.guild.roles.get('name', role.name) && bot.memberHasRole(user, role)) {
        bot.removeMemberFromRole(user, role);
      }
    });
  }, time * 60000);
}

module.exports = {
  commands: {
    'kick': {
      description: 'Kick a user with a message',
      //      usage: "<@users> [message]",
      //      deleteCommand: true,
      //      cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) return;
        if (!perms.has(msg, 'mod')) return;

        if (suffix && msg.mentions.length > 0) {
          const kickMessage = suffix.replace(/<@\d+>/g, '').trim();
          msg.mentions.map(unlucky => {
            if (!kickMessage) msg.channel.guild.kickMember(unlucky);
            else {
              unlucky.sendMessage('You were kicked from ' + msg.channel.guild.name + ' for reason: ' + kickMessage).then(() => msg.channel.guild.kickMember(unlucky));
            }
          });
          msg.channel.sendMessage(msg.author.username + nbsp, (e, m) => {
            bot.deleteMessage(m, {
              'wait': 10000
            });
          });
        } else correctUsage(msg.author, 'kick', '<@users> [message]');
      }
    },
    'ban': {
      description: 'Ban a user with a message (deletes their messages)',
      //      usage: "<@users> [message]",
      //      deleteCommand: true,
      //      cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) return;
        if (!perms.has(msg, 'globalmod')) return;

        if (suffix && msg.mentions.length > 0) {
          const banMessage = suffix.replace(/<@\d+>/g, '').trim();
          msg.mentions.map(unlucky => {
            if (!banMessage) msg.channel.guild.banMember(unlucky, 1);
            else {
              unlucky.sendMessage('You were banned from ' + msg.channel.guild.name + ' for reason: ' + banMessage).then(() => msg.channel.guild.banMember(unlucky, 1));
            }
          });
          msg.channel.sendMessage(msg.author.username + nbsp, (e, m) => {
            bot.deleteMessage(m, {
              'wait': 10000
            });
          });
        } else correctUsage(msg.author, 'ban', '<@users> [message]');
      }
    },
    'mute': {
      description: 'Mute users for the specified time (max 1 hour)',
      //      usage: "<@users> <minutes>",
      //      deleteCommand: true,
      //      cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) return;
        if (!perms.has(msg, 'minimod')) return;

        if (suffix && msg.mentions.length > 0 && /^(<@\d+>( ?)*)*( ?)*(\d+(.\d+)?)$/.test(suffix.trim())) {
          let time = parseFloat(suffix.replace(/<@\d+>/g, '').trim());
          if (time)
            if (time > 60) time = 60;
            else time = 5;
          const role = msg.channel.guild.roles.find(r => r.name.toLowerCase() === 'muted');
          if (role) {
            msg.mentions.map(user => {
              if (!bot.memberHasRole(user, role))
                bot.addMemberToRole(user, role);
            });
            unMute(msg, msg.mentions, time, role);
            msg.channel.sendMessage(msg.author.username + nbsp, (e, m) => {
              bot.deleteMessage(m, {
                'wait': 10000
              });
            });
          } else msg.channel.sendMessage('Please create a role named `muted` that denies send messages in all channels', (e, m) => {
            bot.deleteMessage(m, {
              'wait': 10000
            });
          });
        } else correctUsage(msg.author, 'mute', '<@users> <minutes>');
      }
    },
    'unmute': {
      description: 'Unmute users',
      //      usage: "<@users>",
      //      deleteCommand: true,
      //      cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) return;
        if (!perms.has(msg, 'minimod')) return;

        if (suffix && msg.mentions.length > 0) {
          const role = msg.channel.guild.roles.find(r => r.name.toLowerCase() === 'muted');
          if (role) {
            msg.mentions.map(user => {
              if (bot.memberHasRole(user, role))
                bot.removeMemberFromRole(user, role);
            });
            msg.channel.sendMessage(msg.author.username + nbsp, (e, m) => {
              bot.deleteMessage(m, {
                'wait': 10000
              });
            });
          } else {
            msg.channel.sendMessage('`muted` role not found', (e, m) => {
              bot.deleteMessage(m, {
                'wait': 10000
              });
            });
          }
        } else correctUsage(msg.author, 'unmute', '<@users>');
      }
    },
    'announce': {
      description: 'Send a PM to all users in a server. Admin only',
      //      deleteCommand: false, usage: "<message>", cooldown: 1,
      fn: function(msg, suffix) {
        if (!suffix) {
          msg.channel.sendMessage('You must specify a message to announce', function(erro, wMessage) {
            bot.deleteMessage(wMessage, {
              'wait': 8000
            });
          });
          return;
        }
        if (!perms.has(msg, 'admin')) return;

        if (!msg.channel.isPrivate) {
          if (/^\d+$/.test(suffix)) {
            const index = confirmCodes.indexOf(parseInt(suffix));
            if (index == -1) {
              msg.channel.sendMessage('Code not found', function(erro, wMessage) {
                bot.deleteMessage(wMessage, {
                  'wait': 8000
                });
              });
              return;
            }
            msg.channel.sendMessage('Announcing to all users, this may take a while...');
            let loopIndex = 0;
            const annLoopS = function() {
              if (loopIndex >= msg.channel.guild.members.length) {
                clearInterval(annTimerS);
                return;
              }
              msg.channel.guild.members[loopIndex].sendMessage('📢 ' + announceMessages[index] + ' - from ' + msg.author + ' on ' + msg.channel.guild.name);
              loopIndex++;
            };
            const annTimerS = setInterval(() => {
              annLoopS();
            }, 1100);
            delete confirmCodes[index];
            console.log('Announced "' + announceMessages[index] + '" to members of ' + msg.channel.guild.name);
          } else {
            announceMessages.push(suffix);
            const code = Math.floor(Math.random() * 100000);
            confirmCodes.push(code);
            msg.channel.sendMessage("⚠ This will send a message to **all** users in this server. If you're sure you want to do this say `" + getConfig().trigger + 'announce ' + code + '`');
          }
        } else {
          if (/^\d+$/.test(suffix)) {
            const index = confirmCodes.indexOf(parseInt(suffix));
            if (index == -1) {
              msg.channel.sendMessage('Code not found', function(erro, wMessage) {
                bot.deleteMessage(wMessage, {
                  'wait': 8000
                });
              });
              return;
            }
            msg.channel.sendMessage('Announcing to all servers, this may take a while...');
            let loopIndex = 0;
            const annLoop = function() {
              if (loopIndex >= bot.guilds.size) {
                clearInterval(annTimer);
                return;
              }
              if (!bot.guilds[loopIndex].name.includes('Discord API') && !bot.guilds[loopIndex].name.includes('Discord Bots') && !bot.guilds[loopIndex].name.includes('Discord Developers')) {
                bot.guilds[loopIndex].defaultChannel.sendMessage('📢 ' + announceMessages[index] + ' - from your lord and savior ' + msg.author.username);
                loopIndex++;
              }
            };
            const annTimer = setInterval(() => {
              annLoop();
            }, 1100);
            delete confirmCodes[index];
            console.log('Announced "' + announceMessages[index] + '" to all servers');
          } else {
            announceMessages.push(suffix);
            const code = Math.floor(Math.random() * 100000);
            confirmCodes.push(code);
            msg.channel.sendMessage("⚠ This will send a message to **all** servers where I can speak in general. If you're sure you want to do this say `" + getConfig().trigger + 'announce ' + code + '`');
          }
        }
      }
    },
    'color': {
      description: "Change a role's color",
      //      usage: "<role name> <color in hex>",
      //      deleteCommand: true, cooldown: 5,
      fn: function(msg, suffix) {
        if (/^(.*) #?[A-F0-9]{6}$/i.test(suffix)) {
          if (msg.channel.isPrivate) {
            msg.channel.sendMessage('Must be done in a server!', (erro, wMessage) => {
              bot.deleteMessage(wMessage, {
                'wait': 10000
              });
            });
            return;
          }
          if (!perms.has(msg, 'minimod')) return;

          if (!msg.channel.permissionsFor(bot.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            msg.channel.sendMessage("I can't edit roles!", (erro, wMessage) => {
              bot.deleteMessage(wMessage, {
                'wait': 10000
              });
            });
            return;
          }
          const role = msg.channel.guild.roles.find(r => suffix.replace(/ #?[a-f0-9]{6}/i, '').toLowerCase() == r.name.toLowerCase());
          if (role) {
            bot.updateRole(role, {
              color: parseInt(suffix.replace(/(.*) #?/, ''), 16)
            });
            msg.channel.sendMessage(msg.author.username + ' 👌🏻', (erro, wMessage) => {
              bot.deleteMessage(wMessage, {
                'wait': 10000
              });
            });
          } else msg.channel.sendMessage('Role "' + suffix.replace(/ #?[a-f0-9]{6}/i, '') + '" not found', (erro, wMessage) => {
            bot.deleteMessage(wMessage, {
              'wait': 10000
            });
          });
        } else correctUsage(msg.author, 'color', '<role name> <color in hex>');
      }
    },
    'givecolor': {
      description: 'Give a user a color',
      //      usage: "<@users> <color as hex>",
      //      deleteCommand: true,
      //      cooldown: 4,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) {
          msg.channel.sendMessage("Can't do this in a PM!", (e, m) => {
            bot.deleteMessage(m, {
              'wait': 10000
            });
          });
          return;
        }
        if (!/^<@(.*)> *#?[a-f0-9]{6}$/i.test(suffix)) {
          correctUsage(msg.author, 'givecolor', '<@users> <color as hex>');
          return;
        }
        if (!perms.has(msg, 'minimod')) return;

        if (!msg.channel.permissionsFor(bot.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
          msg.channel.sendMessage("I can't manage roles!", (e, m) => {
            bot.deleteMessage(m, {
              'wait': 10000
            });
          });
          return;
        }
        if (msg.mentions.length < 1) {
          msg.channel.sendMessage('You must mention the users you want to change the color of!', (e, m) => {
            bot.deleteMessage(m, {
              'wait': 10000
            });
          });
          return;
        }

        let role = msg.channel.guild.roles.get('name', '#' + suffix.replace(/(.*) #?/, '').toLowerCase());
        let currentColors2;
        msg.mentions.map(user => {
          const currentColors = msg.channel.guild.rolesOfUser(user).filter(r => /^#[a-f0-9]{6}$/i.test(r.name));
          if (currentColors && currentColors.length > 0) {
            currentColors2 = [];
            currentColors.map(c => {
              if (msg.channel.guild.usersWithRole(c).length > 1) {
                currentColors2.push(c);
              } else {
                bot.deleteRole(c).catch(e => {
                  if (e) console.log('ERROR (deleting role) ' + e);
                });
              }
            });
          }
          if (currentColors2 && currentColors2.length > 0) {
            bot.removeMemberFromRole(user, currentColors2, e => {
              if (e) console.log('ERROR (removing roles) ' + e);
              else {
                if (role) bot.addMemberToRole(user, role, e => {
                  if (e) console.log('ERROR (adding to role) ' + e);
                });
                else {
                  bot.createRole(msg.channel.guild, {
                    color: parseInt(suffix.replace(/(.*) #?/, ''), 16),
                    hoist: false,
                    permissions: [],
                    name: '#' + suffix.replace(/(.*) #?/, '').toLowerCase(),
                    mentionable: false,
                    position: 1/*function() {
                      let maxpos = 9999;
                      let minrole = null;
                      msg.channel.guild.roles.forEach(function(v, k) {
                        if (bot.memberHasRole(bot.user, v) && v.position < maxpos) {
                          maxpos = v.position;
                          minrole = v;
                        }
                      });

                      return maxpos;
                    }()*/
                  }, (e, r) => {
                    if (e) {
                      console.log('ERROR (creating role) ' + e);
                      msg.channel.sendMessage(`Error creating role: ${e}`);
                    } else {
                      role = r;
                      bot.addMemberToRole(user, role, e => {
                        if (e) console.log('ERROR (adding to new role) ' + e);
                        else msg.channel.sendMessage(msg.author.username.replace(/@/g, '@\u200b') + ' 👌🏻', (erro, wMessage) => {
                          bot.deleteMessage(wMessage, {
                            'wait': 10000
                          });
                        });
                      });
                    }
                  });
                }
              }
            });
          } else {
            if (role) bot.addMemberToRole(user, role, e => {
              if (e) console.log('ERROR  (adding to role) ' + e);
            });
            else {
              bot.createRole(msg.channel.guild, {
                color: parseInt(suffix.replace(/(.*) #?/, ''), 16),
                hoist: false,
                permissions: [],
                name: '#' + suffix.replace(/(.*) #?/, '').toLowerCase(),
                mentionable: false,
                position: 1/*function() {
                  let maxpos = 9999;
                  let minrole = null;
                  msg.channel.guild.roles.forEach(function(v, k) {
                    if (bot.memberHasRole(bot.user, v) && v.position < maxpos) {
                      maxpos = v.position;
                      minrole = v;
                    }
                  });

                  return maxpos;
                }()*/
              }, (e, r) => {
                if (e) {
                  console.log('ERROR (creating role) ' + e);
                  msg.channel.sendMessage(`Error creating role: ${e}`);
                } else {
                  role = r;
                  bot.addMemberToRole(user, role, e => {
                    if (e) console.log('ERROR (adding to new role) ' + e);
                    else msg.channel.sendMessage(msg.author.username.replace(/@/g, '@\u200b') + ' 👌🏻', (erro, wMessage) => {
                      bot.deleteMessage(wMessage, {
                        'wait': 10000
                      });
                    });
                  });
                }
              });
            }
          }
        });
      }
    },
    'removecolor': {
      description: "Clean unused colors | Remove a user's color | Remove a color",
      //      usage: "clean | @users | #hexcolor",
      //      deleteCommand: true,
      //      cooldown: 4,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) {
          msg.channel.sendMessage("Can't do this in a PM!", (erro, wMessage) => {
            bot.deleteMessage(wMessage, {
              'wait': 10000
            });
          });
          return;
        }
        if (!perms.has(msg, 'minimod')) return;

        if (!msg.channel.permissionsFor(bot.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
          msg.channel.sendMessage("I can't manage roles!", (erro, wMessage) => {
            bot.deleteMessage(wMessage, {
              'wait': 10000
            });
          });
          return;
        }
        if (msg.mentions.length > 0) {

          msg.mentions.map(user => {
            const colorroles = msg.channel.guild.rolesOfUser(user).filter(r => /^#[a-f0-9]{6}$/.test(r.name));
            const notEmpty = [];
            if (colorroles && colorroles.length > 0) {
              colorroles.map(role => {
                if (msg.channel.guild.usersWithRole(role).length > 1) notEmpty.push(role);
                else bot.deleteRole(role).catch(e => {
                  if (e) console.log('ERROR  ' + e);
                });
              });
              if (notEmpty.length > 0) bot.removeMemberFromRole(user, notEmpty);
            }
          });
          msg.channel.sendMessage(msg.author.username + ' 👌🏻', (erro, wMessage) => {
            bot.deleteMessage(wMessage, {
              'wait': 10000
            });
          });

        } else if (/^#?[a-f0-9]{6}$/i.test(suffix.trim())) {

          const role = msg.channel.guild.roles.get('name', '#' + suffix.replace(/#?/, '').toLowerCase());
          if (!role) msg.channel.sendMessage('Color not found', (erro, wMessage) => {
            bot.deleteMessage(wMessage, {
              'wait': 10000
            });
          });
          else {
            bot.deleteRole(role, e => {
              if (e) {
                msg.channel.sendMessage('Error deleting role: ' + e, (erro, wMessage) => {
                  bot.deleteMessage(wMessage, {
                    'wait': 10000
                  });
                });
                console.log('ERROR  ' + e);
              } else msg.channel.sendMessage(msg.author.username + ' 👌🏻', (erro, wMessage) => {
                bot.deleteMessage(wMessage, {
                  'wait': 10000
                });
              });
            });
          }

        } else if (suffix.trim() == 'clean') {

          let count = 0;
          msg.channel.guild.roles.map(role => {
            if (/^#?[a-f0-9]{6}$/i.test(role.name)) {
              if (msg.channel.guild.usersWithRole(role).length < 1) {
                bot.deleteRole(role).catch(e => {
                  if (e) console.log('ERROR  ' + e);
                });
                count++;
              }
            }
          });
          msg.channel.sendMessage('🎨 Removed ' + count + ' colors with no users', (erro, wMessage) => {
            bot.deleteMessage(wMessage, {
              'wait': 10000
            });
          });

        } else correctUsage(msg.author, 'removecolor', 'clean | @users | #hexcolor');
      }
    },
  }
};