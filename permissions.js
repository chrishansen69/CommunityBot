'use strict';

const rights = {
  'minimod': 'MANAGE_MESSAGES',
  'mod': 'KICK_MEMBERS',
  'globalmod': 'BAN_MEMBERS',
  'admin': 'ADMINISTRATOR',
  'op': '~op'
};

const jsonfile = require('./lib/jsonfile.js');
const chalk = require('chalk');

const utility = require('./utility.js');
const ops = require(utility.dataFolder + 'ops.json');
//const bot = require('./bot.js');

/**
 * Checks if an user has a right
 * 
 * @param  {Message or User} a Message object to check for permissions or User to check for op
 * @param  {String} right
 * @return {Boolean} true if the user has a right
 */
exports.hasRight = function(msg, right) {
  if (msg.username) {
    return ops.indexOf(msg.id) !== -1; // we don't want to stay in the function if this is true
  }
  if (ops.indexOf(msg.author.id) !== -1) return true; // if is OP you got all permissions
  if (right == 'op') return false; // is not OP but we want OP, so nah

  if (rights[right]) {
    return msg.channel.permissionsFor(msg.author).hasPermission(rights[right]);
  }
  return msg.channel.permissionsFor(msg.author).hasPermission(right);
};

/**
 * Checks if an user has a right, and display a message if they don't
 * 
 * @param  {Message or User} a Message object to check for permissions or User to check for op
 * @param  {String} right
 * @return {Boolean} true if the user has a right
 */
exports.has = function(msg, right) {
  const b = exports.hasRight(msg, right);
  if (!b) msg.channel.sendMessage("You don't have permission to use this command!");
  return b;
};

/**
 * gives an user operator rights
 * 
 * user: a discord.js User object
 * 
 * returns false if the user is already an operator
 */
exports.op = function(user) {
  if (ops.indexOf(user.id) !== -1) {
    return false;
  }
  
  ops.push(user.id);
  jsonfile.writeFileSync(utility.dataFolder + 'ops.json', ops, {spaces: 2});
  console.log(chalk.red('Opped user ' + user.username));
  return true;
};

/**
 * takes operator rights from an user
 * 
 * user: a discord.js User object
 * 
 * returns false if the user is not an operator
 */
exports.deop = function(user) {
  const index = ops.indexOf(user.id);
  if (index !== -1) {
    ops.splice(index, 1);
    jsonfile.writeFileSync(utility.dataFolder + 'ops.json', ops, {spaces: 2});
    console.log(chalk.red('De-opped user ' + user.username));
    return true;
  }
  
  return false;
};