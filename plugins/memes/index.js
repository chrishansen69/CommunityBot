'use strict';

const utility = require('../../utility.js');

const emotes = require('./twitch-emotes.json');
const swearifyEmotes = require('./swearify-emotes.json');
const _descdupe = "it's a meme";

// FFZ emote url:
// https://cdn.frankerfacez.com/emoticon/NUMBER/1
// BTTV emote url:
// https://cdn.betterttv.net/emote/NUMBER/1x
// legacy emote url:
// http://emote.3v.fi/2.0/NUMBER.png

//https://nightdev.com/betterttv/firefox/betterttv.xpi
//https://cdn.frankerfacez.com/script/ff_ffz_1.56.xpi
//https://raw.githubusercontent.com/Jiiks/BetterDiscordApp/master/data/emotedata_twitch_subscriber.json
//https://github.com/Jiiks/BetterDiscordApp/tree/master/data

module.exports = {
  name: 'memes',
  commands: {
    emote: {
      synonyms: ['e'],
      fn: function (message, suffix) {
        const s = suffix.toLowerCase();
        if (swearifyEmotes[s]) {
          message.channel.sendFile(swearifyEmotes[s]);
        } else if (emotes[s]) {
          message.channel.sendFile('http://static-cdn.jtvnw.net/emoticons/v1/' + emotes[s] + '/2.0', 'emote.png');
        }
      },
      description: 'send twitch emotes!'
    },
    'find-emote': {
      synonyms: ['fe', 'f-e'],
      fn: function (message, suffix) {
        const s = suffix.toLowerCase();
        const results = ['Search results: '];

        let searchables = Object.keys(emotes);
        searchables.forEach(function (v) {
          if (v.includes(s)) {
            results.push(v + ': http://emote.3v.fi/2.0/' + emotes[v] + '.png');
          }
        });
        searchables = Object.keys(swearifyEmotes);
        searchables.forEach(function (v) {
          if (v.includes(s)) {
            results.push(v + ': ' + swearifyEmotes[v]);
          }
        });

        searchables = results.join('\n');
        if (searchables.length > 1990) {
          message.channel.sendMessage('Too many results (' + results.length + '). Use a less broad search term.');
        } else {
          message.channel.sendMessage(searchables);
        }
      },
      description: 'find twitch emotes!'
    },
  }
};

/// Load emotes n memes

const _emotes = require('./emotes.js');

Object.keys(_emotes).forEach(function(v) {
  utility.registerCommand(v, _emotes[v].fn, _descdupe);
});

const _memes = require('./memes.js');

Object.keys(_memes).forEach(function(v) {
  utility.registerCommand(v, _memes[v].fn, _descdupe);
});

//module.exports.commands = Object.assign(module.exports.commands, o2, o3);