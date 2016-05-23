'use strict';

const bot = require('../../bot.js');
const getConfig = require('../../utility.js').getConfig;
const http = require('http');

if (!getConfig()['lastfm']) {
  getConfig()['lastfm'] = {};
  getConfig()['lastfm'].apiKey = '83a068985f1c01197759735f6cfaca92';
  getConfig()['lastfm'].announceSongs = true;
  getConfig()['lastfm'].users = {
    "exampleServer": {
      "exampleChannel": [
        ["userID", "lastfmName"]
      ]
    }
  };
} else {
  if (!getConfig()['lastfm'].apiKey) {
    getConfig()['lastfm'].apiKey = '83a068985f1c01197759735f6cfaca92';
  }
  if (!getConfig()['music-bot'].announceSongs) {
    getConfig()['music-bot'].announceSongs = true;
  }
  if (!getConfig()['music-bot'].users) {
    getConfig()['music-bot'].users = {
      "exampleServer": {
        "exampleChannel": [
          ["userID", "lastfmName"]
        ]
      }
    };
  }
}

let checkPlayingTimer;

bot.on("ready", function() {
  const conf = getConfig()['music-bot'];
  
  checkPlayingTimer = setInterval(function() {
    
    const servers = Object.keys(conf.users);
    for (let server = 0; server < servers.length; server++) {
      const channels = Object.keys(conf.users[server]);
      
      for (let channel = 0; channel < channels.length; channel++) {
        
        for (let user = 0; user < conf.users[server][channel].length; user++) {
          http.get({
            hostname: 'ws.audioscrobbler.com',
            port: 80,
            path: '/2.0/?method=user.getRecentTracks&user=' + conf.users[server][channel][user][1] + '&api_key=' + getConfig()['lastfm'].apiKey + '&limit=1&format=json&callback=?',
            agent: false
          }, function(response) {
            const resJSON = JSON.parse('true');
            console.info(resJSON);
          });
        }
      }
    }
    
  }, 2000);
});

function getUser(id) {
  bot.channels.get('id', id);
}

function addUserCommand(message, suffix) {
    
    const chan = getConfig()['music-bot'].users[message.channel.server.name][message.channel.name];
    chan[chan.length] = [
      message.sender.id, // discord id
      suffix.split(' ')[0] // lastfm username
    ];
    
    bot.sendMessage(message.channel, 'Added ' + message.sender.name + ' (' + message.sender.id + ') to Now Playing list on this channel');
    
    //bot.sendMessage(_message.channel, 'Rolling `1-' + faces + '`: ' + _message.sender.mention() + ' rolled a ' + result);
}

module.exports = {
    name: 'lastfm-player',
    commands: {
        "lastfm-add": {
            fn: addUserCommand,
            description: 'Adds a lastfm user to the now-playing list'
        },
    },
};