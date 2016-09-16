'use strict';

const bot = require('../../bot.js');
const getConfig = require('../../utility.js').getConfig;
const saveConfig = require('../../utility.js').saveConfig;
const getXData = require('../../utility.js').getXData;
const saveXData = require('../../utility.js').saveXData;

const http = require('http');

if (!getConfig().lastfm || !getXData().lastfm) {
  getConfig().lastfm = {};
  getXData().lastfm = {};
  getConfig().lastfm.apiKey = '83a068985f1c01197759735f6cfaca92';
  getConfig().lastfm.announceSongs = true;
  getXData().lastfm.users = {
    'exampleServer': {
      'exampleChannel': [
        ['userID', 'lastfmName', 'last played song']
      ]
    }
  };
} else {
  if (!getConfig().lastfm.apiKey) {
    getConfig().lastfm.apiKey = '83a068985f1c01197759735f6cfaca92';
  }
  if (!getConfig().lastfm.announceSongs) {
    getConfig().lastfm.announceSongs = true;
  }
  if (!getXData().lastfm.users) {
    getXData().lastfm.users = {
      'exampleServer': {
        'exampleChannel': [
          ['userID', 'lastfmName', 'last played song']
        ]
      }
    };
  }
}

//let checkPlayingTimer;

bot.on('ready', function() {
  const xdata = getXData().lastfm;
  
  /*checkPlayingTimer = */setInterval(function() {
    
    if (!xdata.announceSongs) return;

    let server, channel, tuser;

    const callback = function(res) {

      // response
      console.log('Got response: ' + res.statusCode);
      if (res.statusCode != 200)
        channel.sendMessage(':warning: Server sent status code ' + res.statusCode + ' (' + res.statusMessage + ')'); //unknown status code
      
      let _body = '';
      res.on('data', function(chunk) {
        _body += chunk; // make batch of data
      });
      
      res.on('end', function() { // connection over
        console.log('clodes');
        const body = JSON.parse(_body);
        // {"recenttracks":{"track":[],"@attr":{"user":"lastfmname","page":"1","perPage":"1","totalPages":"0","total":"0"}}}
        
        if (body.recenttracks.track[0]) {
          
          const trk = body.recenttracks.track[0].artist['#text'] + // artist
            ' - ' + body.recenttracks.track[0].name; // track name
          
          if (trk !== tuser[2]) {
            tuser[2] = trk;
            
            channel.sendMessage(// msg in the channel
              getUser(tuser[0]).toString() + // @mention the user
              ' now playing: ' + trk);
          }
        } else {
          console.log('errrrr...');
          channel.sendMessage('Error: LastFM return body structure changed');
        }
      });
    };
    
    const servers = Object.keys(xdata.users);
    for (let i = 0, il = servers.size; i < il; i++) {
      server = servers[i];
      const channels = Object.keys(xdata.users[server]);
      
      for (let j = 0, jl = channels.size; j < jl; j++) {
        channel = channels[j];
        
        for (let user = 0, ulen = xdata.users[server][channel].length; user < ulen; user++) {
          tuser = xdata.users[server][channel][user];
          http.get({
            hostname: 'ws.audioscrobbler.com',
            port: 80,
            path: '/2.0/?method=user.getRecentTracks&user=' + tuser[1] + '&api_key=' + getConfig().lastfm.apiKey + '&limit=1&format=json',
            agent: false
          }, callback);
        }
      }
    }
    
  }, 120000);
});

function getUser(id) {
  return bot.users.get(id);
}

function removeMeCommand(message) { // TODO doesn't remove server / channel entries
  try {
    const servername = message.channel.guild.id;
    const channelname = message.channel.id;

    const chan = getXData().lastfm.users[servername][channelname];
    for (let i = 0; i < chan.length; i++) {
      if (chan[i][0] == message.author.id) {
        chan.splice(i, 1);
        message.channel.sendMessage('Removed ' + message.author.username + ' (' + message.author.id + ') from the Now Playing list on this channel');
        saveXData();
        saveConfig();
        return;
      }
    }
  } catch (e) {
    message.channel.sendMessage('**Error removing user**: `' + e + '`');
    console.error(e);
  }
}

function addUserCommand(message, suffix) { // TODO doesn't create server / channel entries
  const servername = message.channel.guild.id;
  const channelname = message.channel.id;
  
  if (!getXData().lastfm.users[servername])
    getXData().lastfm.users[servername] = {};
  
  if (!getXData().lastfm.users[servername][channelname])
    getXData().lastfm.users[servername][channelname] = [];
  
  const chan = getXData().lastfm.users[servername][channelname];
  chan.push([
    message.author.id, // discord id
    suffix.split(' ')[0], // lastfm username
    'last played song'
  ]);
  
  saveConfig();
  saveXData();
  
  message.channel.sendMessage('Added ' + message.author.username + ' (' + message.author.id + ') to Now Playing list on this channel');
  
  //_message.channel.sendMessage('Rolling `1-' + faces + '`: ' + _message.author.toString() + ' rolled a ' + result);
}

module.exports = {
    name: 'lastfm-player',
    commands: {
        'lastfm-add': {
            fn: addUserCommand,
            description: 'Adds a lastfm user to the now-playing list'
        },
        'lastfm-remove': {
            fn: removeMeCommand,
            description: 'Removes yourself from the now-playing list'
        },
    },
};