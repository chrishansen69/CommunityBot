"use strict";

const perms = require('./permissions.js');

const bot = require('../../bot.js');
const utility = require('../../utility.js');
const getConfig = utility.getConfig;
const nbsp = " 👌🏻";

let confirmCodes = [];
let announceMessages = [];

/**
 * @param  {User} sender
 * @param  {String} command
 * @param  {String} usage
 */
function correctUsage(sender, command, usage) {
  bot.sendMessage(sender, '`' + getConfig().trigger + command + '` command usage: `' + usage + '`');
}

function unMute(msg, users, time, role) {
  setTimeout(() => {
    users.map((user) => {
      if (msg.channel.server.members.get("name", user.username) && msg.channel.server.roles.get("name", role.name) && bot.memberHasRole(user, role)) {
        bot.removeMemberFromRole(user, role);
      }
    });
  }, time * 60000);
}

module.exports = {
  commands: {
    "kick": {
      description: "Kick a user with a message",
//      usage: "<@users> [message]",
//      deleteCommand: true,
//      cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) return;
        if (!perms.has(msg, "mod")) return;

        if (suffix && msg.mentions.length > 0) {
          let kickMessage = suffix.replace(/<@\d+>/g, "").trim();
          msg.mentions.map(unlucky => {
            if (!kickMessage) msg.channel.server.kickMember(unlucky);
            else {
              bot.sendMessage(unlucky, "You were kicked from " + msg.channel.server.name + " for reason: " + kickMessage).then(() => msg.channel.server.kickMember(unlucky));
            }
          });
          bot.sendMessage(msg, msg.author.username + nbsp, (e,m) => { bot.deleteMessage(m, {"wait": 10000}); });
        } else correctUsage(msg.sender, "kick", "<@users> [message]");
      }
    },
    "ban": {
      description: "Ban a user with a message (deletes their messages)",
//      usage: "<@users> [message]",
//      deleteCommand: true,
//      cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) return;
        if (!perms.has(msg, "globalmod")) return;
        
        if (suffix && msg.mentions.length > 0) {
          let banMessage = suffix.replace(/<@\d+>/g, "").trim();
          msg.mentions.map(unlucky => {
            if (!banMessage) msg.channel.server.banMember(unlucky, 1);
            else {
              bot.sendMessage(unlucky, "You were banned from " + msg.channel.server.name + " for reason: " + banMessage).then(() => msg.channel.server.banMember(unlucky, 1));
            }
          });
          bot.sendMessage(msg, msg.author.username + nbsp, (e,m) => { bot.deleteMessage(m, {"wait": 10000}); });
        } else correctUsage(msg.sender, "ban", "<@users> [message]");
      }
    },
    "mute": {
      description: "Mute users for the specified time (max 1 hour)",
//      usage: "<@users> <minutes>",
//      deleteCommand: true,
//      cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) return;
        if (!perms.has(msg, "minimod")) return;
        
        if (suffix && msg.mentions.length > 0 && /^(<@\d+>( ?)*)*( ?)*(\d+(.\d+)?)$/.test(suffix.trim())) {
          let time = parseFloat(suffix.replace(/<@\d+>/g, '').trim());
          if (time)
            if (time > 60) time = 60;
          else time = 5;
          let role = msg.channel.server.roles.find(r => r.name.toLowerCase() === "muted");
          if (role) {
            msg.mentions.map(user => {
              if (!bot.memberHasRole(user, role))
                bot.addMemberToRole(user, role);
            });
            unMute(msg, msg.mentions, time, role);
            bot.sendMessage(msg, msg.author.username + nbsp, (e,m) => { bot.deleteMessage(m, {"wait": 10000}); });
          } else bot.sendMessage(msg, "Please create a role named `muted` that denies send messages in all channels", (e,m) => { bot.deleteMessage(m, {"wait": 10000}); });
        } else correctUsage(msg.sender, "mute", "<@users> <minutes>");
      }
    },
    "unmute": {
      description: "Unmute users",
//      usage: "<@users>",
//      deleteCommand: true,
//      cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) return;
        if (!perms.has(msg, "minimod")) return;
        
        if (suffix && msg.mentions.length > 0) {
          let role = msg.channel.server.roles.find(r => r.name.toLowerCase() === "muted");
          if (role) {
            msg.mentions.map(user => {
              if (bot.memberHasRole(user, role))
                bot.removeMemberFromRole(user, role);
            });
            bot.sendMessage(msg, msg.author.username + nbsp, (e,m) => { bot.deleteMessage(m, {"wait": 10000}); });
          } else { bot.sendMessage(msg, "`muted` role not found", (e,m) => { bot.deleteMessage(m, {"wait": 10000}); }); }
        } else correctUsage(msg.sender, "unmute", "<@users>");
      }
    },
    "announce": {
      description: "Send a PM to all users in a server. Admin only",
//      deleteCommand: false, usage: "<message>", cooldown: 1,
      fn: function(msg, suffix) {
        if (!suffix) { bot.sendMessage(msg, "You must specify a message to announce", function(erro, wMessage) { bot.deleteMessage(wMessage, {"wait": 8000}); }); return; }
        if (!perms.has(msg, "admin")) return;

        if (!msg.channel.isPrivate) {
          if (/^\d+$/.test(suffix)) {
            let index = confirmCodes.indexOf(parseInt(suffix));
            if (index == -1) { bot.sendMessage(msg, "Code not found", function(erro, wMessage) { bot.deleteMessage(wMessage, {"wait": 8000}); }); return; }
            bot.sendMessage(msg, "Announcing to all users, this may take a while...");
            let loopIndex = 0;
            let annLoopS = function() {
              if (loopIndex >= msg.channel.server.members.length) { clearInterval(annTimerS); return; }
              bot.sendMessage(msg.channel.server.members[loopIndex], "📢 " + announceMessages[index] + " - from " + msg.author + " on " + msg.channel.server.name);
              loopIndex++;
            };
            let annTimerS = setInterval(() => { annLoopS(); }, 1100);
            delete confirmCodes[index];
            console.log("Announced \"" + announceMessages[index] + "\" to members of " + msg.channel.server.name);
          } else {
            announceMessages.push(suffix);
            let code = Math.floor(Math.random() * 100000);
            confirmCodes.push(code);
            bot.sendMessage(msg, "⚠ This will send a message to **all** users in this server. If you're sure you want to do this say `" + getConfig().trigger + "announce " + code + "`");
          }
        } else {
          if (/^\d+$/.test(suffix)) {
            let index = confirmCodes.indexOf(parseInt(suffix));
            if (index == -1) { bot.sendMessage(msg, "Code not found", function(erro, wMessage) { bot.deleteMessage(wMessage, {"wait": 8000}); }); return; }
            bot.sendMessage(msg, "Announcing to all servers, this may take a while...");
            let loopIndex = 0;
            let annLoop = function() {
              if (loopIndex >= bot.servers.length) { clearInterval(annTimer); return; }
              if (!bot.servers[loopIndex].name.includes("Discord API") && !bot.servers[loopIndex].name.includes("Discord Bots") && !bot.servers[loopIndex].name.includes("Discord Developers")) {
                bot.sendMessage(bot.servers[loopIndex].defaultChannel, "📢 " + announceMessages[index] + " - from your lord and savior " + msg.author.username);
                loopIndex++;
              }
            };
            let annTimer = setInterval(() => { annLoop(); }, 1100);
            delete confirmCodes[index];
            console.log("Announced \"" + announceMessages[index] + "\" to all servers");
          } else {
            announceMessages.push(suffix);
            let code = Math.floor(Math.random() * 100000);
            confirmCodes.push(code);
            bot.sendMessage(msg, "⚠ This will send a message to **all** servers where I can speak in general. If you're sure you want to do this say `" + getConfig().trigger + "announce " + code + "`");
          }
        }
      }
    },
    "color": {
      description: "Change a role's color",
//      usage: "<role name> <color in hex>",
//      deleteCommand: true, cooldown: 5,
      fn: function(msg, suffix) {
        if (/^(.*) #?[A-F0-9]{6}$/i.test(suffix)) {
          if (msg.channel.isPrivate) { bot.sendMessage(msg, "Must be done in a server!", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
          if (!perms.has(msg, "minimod")) return;
          
          if (!msg.channel.permissionsOf(bot.user).hasPermission("manageRoles")) { bot.sendMessage(msg, "I can't edit roles!", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
          let role = msg.channel.server.roles.find(r=>suffix.replace(/ #?[a-f0-9]{6}/i, "").toLowerCase() == r.name.toLowerCase());
          if (role) {
            bot.updateRole(role, {color: parseInt(suffix.replace(/(.*) #?/, ""), 16)}); bot.sendMessage(msg, msg.author.username + " 👌🏻", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });
          } else bot.sendMessage(msg, "Role \"" + suffix.replace(/ #?[a-f0-9]{6}/i, "") + "\" not found", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });
        } else correctUsage(msg.sender, "color", "<role name> <color in hex>");
      }
    },
    "givecolor": {
      description: "Give a user a color",
//      usage: "<@users> <color as hex>",
//      deleteCommand: true,
//      cooldown: 4,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) {
          bot.sendMessage(msg, "Can't do this in a PM!",(e,m) => { bot.deleteMessage(m, {"wait": 10000}); });
          return;
        }
        if (!/^<@(.*)> *#?[a-f0-9]{6}$/i.test(suffix)) {
          correctUsage(msg.sender, "givecolor", "<@users> <color as hex>");
          return;
        }
        if (!perms.has(msg, "minimod")) return;

        if (!msg.channel.permissionsOf(bot.user).hasPermission("manageRoles")) {
          bot.sendMessage(msg, "I can't manage roles!",(e,m) => { bot.deleteMessage(m, {"wait": 10000}); });
          return;
        }
        if (msg.mentions.length < 1) {
          bot.sendMessage(msg, "You must mention the users you want to change the color of!",(e,m) => { bot.deleteMessage(m, {"wait": 10000}); });
          return;
        }

        let role = msg.channel.server.roles.get("name", "#" + suffix.replace(/(.*) #?/, "").toLowerCase());
        let currentColors2;
        msg.mentions.map(user => {
          let currentColors = msg.channel.server.rolesOfUser(user).filter(r=>/^#[a-f0-9]{6}$/i.test(r.name));
          if (currentColors && currentColors.length > 0) {
            currentColors2 = [];
            currentColors.map(c => {
              if (msg.channel.server.usersWithRole(c).length > 1) {
                currentColors2.push(c);
              } else {
                bot.deleteRole(c).catch(e => {
                  if (e) console.log("ERROR (deleting role) " + e);
                });
              }
            });
          }
          if (currentColors2 && currentColors2.length > 0) {
            bot.removeMemberFromRole(user, currentColors2, e => {
              if (e) console.log("ERROR (removing roles) " + e);
              else {
                if (role) bot.addMemberToRole(user, role, e => {
                  if (e) console.log("ERROR (adding to role) " + e);
                });
                else {
                  bot.createRole(msg.channel.server, {color: parseInt(suffix.replace(/(.*) #?/, ""), 16), hoist: false, permissions: [], name: "#" + suffix.replace(/(.*) #?/, "").toLowerCase()}, (e, r) => {
                    if (e) {
                      console.log("ERROR (creating role) " + e);
                      bot.sendMessage(msg, `Error creating role: ${e}`);
                    } else {
                      role = r;
                      bot.addMemberToRole(user, role, e=>{
                        if (e) console.log("ERROR (adding to new role) " + e);
                        else bot.sendMessage(msg, msg.author.username.replace(/@/g, '@\u200b') + " 👌🏻", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });
            }); } }); } } });
          } else {
            if (role) bot.addMemberToRole(user, role, e=>{
              if (e) console.log("ERROR  (adding to role) " + e);
            });
            else {
              bot.createRole(msg.channel.server, {color: parseInt(suffix.replace(/(.*) #?/, ""), 16), hoist: false, permissions: [], name: "#" + suffix.replace(/(.*) #?/, "").toLowerCase()}, (e, r)=>{
                if (e) {
                  console.log("ERROR (creating role) " + e);
                  bot.sendMessage(msg, `Error creating role: ${e}`);
                } else {
                  role = r;
                  bot.addMemberToRole(user, role, e=>{
                    if (e) console.log("ERROR (adding to new role) " + e);
                    else bot.sendMessage(msg, msg.author.username.replace(/@/g, '@\u200b') + " 👌🏻", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });
              }); } }); }
          }
        });
      }
    },
    "removecolor": {
      description: "Clean unused colors | Remove a user's color | Remove a color",
//      usage: "clean | @users | #hexcolor",
//      deleteCommand: true,
//      cooldown: 4,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) { bot.sendMessage(msg, "Can't do this in a PM!", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
        if (!perms.has(msg, "minimod")) return;

        if (!msg.channel.permissionsOf(bot.user).hasPermission("manageRoles")) { bot.sendMessage(msg, "I can't manage roles!", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
        if (msg.mentions.length > 0) {

          msg.mentions.map(user=>{
            let colorroles = msg.channel.server.rolesOfUser(user).filter(r=>/^#[a-f0-9]{6}$/.test(r.name));
            let notEmpty = [];
            if (colorroles && colorroles.length > 0) {
              colorroles.map(role=>{
                if (msg.channel.server.usersWithRole(role).length > 1) notEmpty.push(role);
                else bot.deleteRole(role).catch(e=> {
                  if (e) console.log("ERROR  " + e); 
                });
              });
              if (notEmpty.length > 0) bot.removeMemberFromRole(user, notEmpty);
            }
          });
          bot.sendMessage(msg, msg.author.username + " 👌🏻", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });

        } else if (/^#?[a-f0-9]{6}$/i.test(suffix.trim())) {

          let role = msg.channel.server.roles.get("name", "#" + suffix.replace(/#?/, "").toLowerCase());
          if (!role) bot.sendMessage(msg, "Color not found", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });
          else {
            bot.deleteRole(role, e=>{
              if (e) {
                bot.sendMessage(msg, "Error deleting role: " + e, (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });
                console.log("ERROR  " + e);
              } else bot.sendMessage(msg, msg.author.username + " 👌🏻", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });
            });
          }

        } else if (suffix.trim() == "clean") {

          let count = 0;
          msg.channel.server.roles.map(role=>{
            if (/^#?[a-f0-9]{6}$/i.test(role.name)) {
              if (msg.channel.server.usersWithRole(role).length < 1) {
                bot.deleteRole(role).catch(e=>{
                  if (e) console.log("ERROR  " + e);
                });
                count++;
              }
            }
          });
          bot.sendMessage(msg, "🎨 Removed " + count + " colors with no users", (erro, wMessage) => { bot.deleteMessage(wMessage, {"wait": 10000}); });

        } else correctUsage(msg.sender, "removecolor", "clean | @users | #hexcolor");
      }
    },
  }
};