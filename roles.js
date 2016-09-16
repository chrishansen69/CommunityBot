'use strict';

//const unirest = require('unirest');
const needle = require('needle');

const bot = require('./bot.js');
//const GLOBAL_REQUEST_DELAY = 0;

const Role = exports.Role = function(body) {
  copyKeys(body, this);
};

exports.servers = {};

exports.initialize = function() {
  bot.guilds.forEach(function(serv, id) {
    exports.servers[id] = {};
    
    serv.roles.forEach(function(role, aid) {
      exports.servers[id][aid] = new Role(role); // this probably won't update if the bot joins a new server until restart
    });
  });
};

/**
 * roles.createRole("Your Server ID");
 */
exports.createRole = function(serverID, callback) {
  checkRS(function() {
    req('post', 'https://discordapp.com/api/guilds/' + serverID + '/roles', function(err, res) {
      try {
        exports.servers[serverID].roles[res.body.id] = new Role(res.body);
      } catch(e) {}
      handleResCB('Unable to create role', err, res, callback);
    });
  });
};

/**
 * Please read the Permissions and Colors readmes, only so you don't destroy
 * your roles and unleash chaos upon your server. (Won't actually go through
 * if there are any issues)
 * 
 * roles.editRole({
 *     server: "Your Server ID",
 *     role: "Your Role ID",
 *     name: "Awesome Role Name",
 *     hoist: true, //or false, will seperate them
 *     permissions: {
 *         GENERAL_CREATE_INSTANT_INVITE: false,
 *         TEXT_MENTION_EVERYONE: true,
 *         VOICE_CONNECT: true
 *     }, //Read the permissions readme, IMPORTANT
 *     color: "DARK_AQUA" //Read the colors readme, IMPORTANT
 * });
 */
exports.editRole = function(input, callback) {
  checkRS(function() {
    let role, payload;
    try {
      role = new Role(exports.servers[input.server].roles[input.role]);
      payload = {
        name: role.name,
        permissions: role.permissions,
        color: role.color,
        hoist: role.hoist
      };

      for (const key in input) {
        if (Object.keys(payload).indexOf(key) === -1) continue;
        if (key === 'permissions') {
          for (const perm in input[key]) {
            role[perm] = input[key][perm];
            payload.permissions = role.permissions;
          }
          continue;
        }
        if (key === 'color') {
          if (String(input[key])[0] === '#') payload.color = parseInt(String(input[key]).replace('#', '0x'), 16);
          if (role.color_values[input[key]]) payload.color = role.color_values[input[key]];
          continue;
        }
        payload[key] = input[key];
      }
      req('patch', 'https://discordapp.com/api/guilds/' + input.server + '/roles/' + input.role, payload, function(err, res) {
        handleResCB('Unable to edit role', err, res, callback);
      });
    } catch(e) {return handleErrCB(e, callback);}
  });
};

/**
 * roles.deleteRole({
 *     server: "Your Server ID",
 *     role: "Your Role ID"
 * });
 */
exports.deleteRole = function(input, callback) {
  checkRS(function() {
    req('delete', 'https://discordapp.com/api/guilds/' + input.server + '/roles/' + input.role, function(err, res) {
      handleResCB('Could not remove role', err, res, callback);
    });
  });
};

/**
 * roles.addToRole({
 *     server: "Your Server ID",
 *     user: "The User ID",
 *     role: "The Role ID"
 * });
 */
exports.addToRole = function(input, callback) {
  checkRS(function() {
    let roles;
    try {
      roles = JSON.parse(JSON.stringify(exports.servers[input.server].members[input.user].roles));
      if (roles.indexOf(input.role) > -1) return handleErrCB((input.user + ' already has the role ' + input.role), callback);
      roles.push(input.role);
      req('patch', 'https://discordapp.com/api/guilds/' + input.server + '/members/' + input.user, {roles: roles}, function(err, res) {
        handleResCB('Could not add role', err, res, callback);
      });
    } catch(e) {return handleErrCB(e, callback);}
  });
};

/**
 * roles.removeFromRole({
 *     server: "Your Server ID",
 *     user: "The User ID",
 *     role: "The Role ID"
 * });
 */
exports.removeFromRole = function(input, callback) {
  checkRS(function() {
    let roles;
    try {
      roles = JSON.parse(JSON.stringify(exports.servers[input.server].members[input.user].roles));
      if (roles.indexOf(input.role) === -1) return handleErrCB(('Role ' + input.role + ' not found for user ' + input.user), callback);
      roles.splice(roles.indexOf(input.role), 1);
      req('patch', 'https://discordapp.com/api/guilds/' + input.server + '/members/' + input.user, {roles: roles}, function(err, res) {
        handleResCB('Could not remove role', err, res, callback);
      });
    } catch(e) {return handleErrCB(e, callback);}
  });
};

/**
 * roles.editNickname({
 *   userID: "The User ID",
 *   serverID: "The Server ID", // if the user is not yourself
 *   nick: "The nickname"
 * });
 */
exports.editNickname = function(input, callback) {
  checkRS(function() {
    const payload = {nick: String( input.nick ? input.nick : '' )};
    const url = input.userID === bot.user.id ?
      'https://discordapp.com/api/guilds/' + input.serverID + '/members/@me/nick':
      'https://discordapp.com/api/guilds/' + input.serverID + '/members/' + input.userID;

    req('patch', url, payload, function(err, res) {
      handleResCB('Could not change nickname', err, res, callback);
    });
  });
};





/**
 * UTILITY FUNCTIONS
 */

//function apiRequest(method, url, useAuth, data, file) {
//  var _this = this,
//      _arguments = arguments;
//
//  var endpoint = url.replace(/\/[0-9]+/g, "/:id");
//  if (this.retryAfters[endpoint]) {
//    if (this.retryAfters[endpoint] < Date.now()) {
//      delete this.retryAfters[endpoint];
//    } else {
//      return new Promise(function(resolve, reject) {
//        setTimeout(function() {
//          _this.apiRequest.apply(_this, _arguments).then(resolve)["catch"](reject);
//        }, _this.retryAfters[endpoint] - Date.now());
//      });
//    }
//  }
//  var ret = _superagent2["default"][method](url);
//  if (useAuth) {
//    ret.set("authorization", this.token);
//  }
//  if (file) {
//    ret.attach("file", file.file, file.name);
//    if (data) {
//      for (var i in data) {
//        if (data[i] !== undefined) {
//          ret.field(i, data[i]);
//        }
//      }
//    }
//  } else if (data) {
//    ret.send(data);
//  }
//  ret.set('User-Agent', this.userAgentInfo.full);
//  return new Promise(function(resolve, reject) {
//    ret.end(function(error, data) {
//      if (error) {
//        if (!_this.client.options.rateLimitAsError && error.response && error.response.error && error.response.error.status && error.response.error.status === 429) {
//
//          if (data.headers["retry-after"] || data.headers["Retry-After"]) {
//            var toWait = data.headers["retry-after"] || data.headers["Retry-After"];
//            if (!_this.retryAfters[endpoint]) _this.retryAfters[endpoint] = Date.now() + parseInt(toWait);
//            setTimeout(function() {
//              _this.apiRequest.apply(_this, _arguments).then(resolve)["catch"](reject);
//            }, _this.retryAfters[endpoint] - Date.now());
//          } else {
//            return reject(error);
//          }
//        } else {
//          return reject(error);
//        }
//      } else {
//        resolve(data.body);
//      }
//    });
//  });
//};






function messageHeaders() {
  return {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US;q=0.8',
    'DNT': '1',
    'User-Agent': bot.internal.userAgentInfo.full,
    'authorization': bot.internal.token
  };
}

function checkStatus(response) {
  return (response.statusCode / 100 | 0) === 2;
}

function checkRS(callback) {
  return callback();
}

function handleErrCB(err, callback) {
  if (typeof(callback) !== 'function') return;
  return callback({message: err});
}

function handleResCB(errMessage, err, res, callback) {
  if (typeof(callback) !== 'function') return;
  if (!res) res = {};
  const e = {
    message: err || errMessage,
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    response: res.body
  };
  if (err || !checkStatus(res)) return callback(e);
  return callback(null, res.body);
}

/**
req('patch', "https://discordapp.com/api/guilds/" + input.server + "/roles/" + input.role, payload, function(err, res) {
  handleResCB("Unable to edit role", err, res, callback);
});
*/
function req(method, url, _dataCallback, _callback) {
  //let Request = unirest(method, url).headers(messageHeaders());
  //
  //let callback = _callback || _dataCallback;
  //if (typeof(_dataCallback) !== 'function') {
  //  Request.send(_dataCallback);
  //}
  //
  //Request.end(function(response) {
  //  console.log(response.body);
  //  callback(null, response);
  //});
  
  let data, callback;
  if (typeof(_dataCallback) === 'function') { callback = _dataCallback; } else { data = _dataCallback; callback = _callback; }
  const isJSON = (function() {
    if (typeof(data) === 'object') {
      if (data.qs)
        return (delete data.qs, false);
      return true;
    }

    return false;
  })();
  return needle.request(method, url, data, {
    multipart: (typeof(data) === 'object' && !!data.file),
    /* jshint validthis: true */
    headers: messageHeaders.call(this),
    json: isJSON
  }, callback);
  
  
  //apiRequest(method, url, _dataCallback, _callback);
  //setTimeout(apiRequest.bind.apply(apiRequest, [bot, arguments[0], arguments[1], arguments[2], arguments[3]]), GLOBAL_REQUEST_DELAY);
}

function copyKeys(from, to, omit) {
  if (!omit) omit = [];
  for (const key in from) {
    if (omit.indexOf(key) > -1) continue;
    to[key] = from[key];
  }
}
