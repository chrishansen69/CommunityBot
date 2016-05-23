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
        ["userID", "lastfmName", "last played song"]
      ]
    }
  };
} else {
  if (!getConfig()['lastfm'].apiKey) {
    getConfig()['lastfm'].apiKey = '83a068985f1c01197759735f6cfaca92';
  }
  if (!getConfig()['lastfm'].announceSongs) {
    getConfig()['lastfm'].announceSongs = true;
  }
  if (!getConfig()['lastfm'].users) {
    getConfig()['lastfm'].users = {
      "exampleServer": {
        "exampleChannel": [
          ["userID", "lastfmName", "last played song"]
        ]
      }
    };
  }
}

let checkPlayingTimer;

bot.on("ready", function() {
  const conf = getConfig()['lastfm'];
  
  checkPlayingTimer = setInterval(function() {
    
    if (!conf.announceSongs) return;
    
    const servers = Object.keys(conf.users);
    for (let i = 0; i < servers.length; i++) {
      const channels = Object.keys(conf.users[servers[i]]);
      
      for (let j = 0; j < channels.length; j++) {
        
        for (let user = 0; user < conf.users[servers[i]][channels[j]].length; user++) {
          http.get({
            hostname: 'ws.audioscrobbler.com',
            port: 80,
            path: '/2.0/?method=user.getRecentTracks&user=' + conf.users[servers[i]][channels[j]][user][1] + '&api_key=' + getConfig()['lastfm'].apiKey + '&limit=1&format=json',
            agent: false
          }, function(res) {
            // response
            console.log("Got response: " + res.statusCode);
            if (res.statusCode != 200)
              bot.sendMessage(getChannel(servers[i], channels[j]), ":warning: Server sent status code " + res.statusCode + " (" + res.statusMessage + ")"); //unknown status code
            
            let _body = '';
            res.on("data", function(chunk) {
              _body += chunk; // make batch of data
            });
            
            res.on("end", function() { // connection over
              console.log("clodes");
              const body = JSON.parse(_body);
              // {"recenttracks":{"track":[],"@attr":{"user":"lastfmname","page":"1","perPage":"1","totalPages":"0","total":"0"}}}
              
              if (body.recenttracks.track[0]) {
                
                const trk = body.recenttracks.track[0].artist['#text'] + // artist
                  " - " + body.recenttracks.track[0].name; // track name
                
                if (trk !== conf.users[servers[i]][channels[j]][user][2]) {
                  conf.users[servers[i]][channels[j]][user][2] = trk;
                  
                  bot.sendMessage(getChannel(servers[i], channels[j]), // msg in the channel
                    getUser(conf.users[servers[i]][channels[j]][user][0]).mention() + // @mention the user
                    " now playing: " + trk);
                }
              }
              else console.log("errrrr...");
            });
          });
        }
      }
    }
    
  }, 2000);
});

function getUser(id) {
  return bot.users.get('id', id);
}

function getChannel(server, name) {
  return bot.servers.get('name', server).channels.get('name', name);
}

function addUserCommand(message, suffix) {
    
    const chan = getConfig()['lastfm'].users[message.channel.server.name][message.channel.name];
    chan[chan.length] = [
      message.sender.id, // discord id
      suffix.split(' ')[0], // lastfm username
      'last played song'
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