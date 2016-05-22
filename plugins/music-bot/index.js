'use strict';

// Discord Bot API
const getConfig = require('../../utility.js').getConfig;
//import bot from '../../modules/bot';
//import events from '../../modules/events';

// Other
//import fetchVideoInfo from 'youtube-info';
//import YoutubeMp3Downloader from 'youtube-mp3-downloader';
//import mkdirp from 'mkdirp';
//import fs from 'fs';
//import chalk from 'chalk';
//import os from 'os';

const bot = require('../../bot.js');
const chalk = require('chalk');
const os = require('os');
const fs = require('fs');
const mkdirp = require('mkdirp');
const fetchVideoInfo = require('youtube-info');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');

// setup configs if not exists
if (!getConfig()['music-bot']) {
  getConfig()['music-bot'] = {};
  getConfig()['music-bot'].library = '../music';
  getConfig()['music-bot'].skipLimit = 1;
  getConfig()['music-bot'].announceSongs = true;
  getConfig()['music-bot'].autoJoinVoiceChannel = 'General';
  getConfig()['music-bot'].maxLength = 15;
} else {
  if (!getConfig()['music-bot'].library) {
    getConfig()['music-bot'].library = '../music';
  }
  if (!getConfig()['music-bot'].skipLimit) {
    getConfig()['music-bot'].skipLimit = 1;
  }
  if (!getConfig()['music-bot'].announceSongs) {
    getConfig()['music-bot'].announceSongs = true;
  }
  if (!getConfig()['music-bot'].autoJoinVoiceChannel) {
    getConfig()['music-bot'].autoJoinVoiceChannel = 'General';
  }
  if (!getConfig()['music-bot'].maxLength) {
    getConfig()['music-bot'].maxLength = 15;
  }
}

/*
"music-bot": {
    "commands": {
        "add": {
            "channel": "#music"
        }
    },
    "commandPrefix": "music",
    "library": "../music",
    "skipLimit": 1,
    "announceSongs": true,
    "autoJoinVoiceChannel": "General",
    "maxLength": 15
}
*/

let YD = new YoutubeMp3Downloader({
    outputPath: getConfig()['music-bot'].library ? getConfig()['music-bot'].library + '/youtube' : (os.platform() === 'win32' ? 'C:/Windows/Temp/youtube' : '/tmp/youtube'),
    queueParallelism: 5,
});

let playlist = []; // All requested songs will be saved in this array
let voiceChannelID = null; // The ID of the voice channel the bot has entered will be saved in this variable
let currentSong = null; // The current song will be saved in this variable
let downloadQueue = {};
let usersWantToSkip = []; // The id of the users that want to skip the current song will be stored in this array

YD.on('finished', function(data) {
    // Add the song to the playlist
    playlist.push({
        youtubeID: data.videoId,
        url: data.youtubeUrl,
        title: data.videoTitle,
        file: data.file,
    });
    bot.sendMessage(downloadQueue['yt:' + data.videoId].channelID, '`' + data.videoTitle + '` added to the playlist. Position: ' + playlist.length);
    delete downloadQueue['yt:' + data.videoId];
});

YD.on('error', function(error) {
    console.error(error);
    // bot.sendMessage(downloadQueue['yt:' + error.videoId].channelID, 'The download of <' + error.youtubeURL + '> failed. Check out terminal of the bot to get more information.');
    // delete downloadQueue['yt:' + error.videoId];
});

// Iterate through the playlist until there are no songs anymore
function playLoop(channelID) {
    // Check if the bot is in a voice channel
    if (voiceChannelID) {
        if (playlist.length < 1) {
            return false;
        }

        const nextSong = playlist[0]; // Get the first song of the playlist
        playlist.shift(); // Removes the now playing song from the playlist
        currentSong = nextSong;
        usersWantToSkip = [];
        bot.setPresence({
            game: nextSong.title,
        });

        const announceSongs = getConfig()['music-bot'].announceSongs === false ? false : true;
        if (announceSongs) {
            bot.sendMessage(channelID, 'Now playing: ' + nextSong.url);
        }

        bot.getAudioContext({channel: voiceChannelID, stereo: true}, function(stream) {
            stream.playAudioFile(currentSong.file);
            stream.oncefunction('fileEnd', function() {
                if (currentSong) {
                    // Hack required because the event fileEnd does not trigger when the file ends ...
                    setTimeout(function() {
                        currentSong = null;
                        bot.setPresence({
                            game: null,
                        });
                        playLoop(channelID);
                    }, 2000);
                }
            });
        });
    } else {
        bot.sendMessage(channelID, 'The bot is not in a voice channel.');
    }
}

function extractYouTubeID(url, channelID) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const matches = url.match(regExp);
    if (matches && matches[2].length === 11) {
        return matches[2];
    } else {
        bot.sendMessage(channelID, 'This seems to be an invalid link.');
        return false;
    }
}

function addCommand(_message) { let message = _message.content; let serverID = _message.channel.server.id; let user = _message.sender; let userID = _message.sender.id; let channelID = _message.channel.id;
    // Get the URL from the message (it should be the first element after the command)
    const url = message.split(' ')[0];

    if (url.length < 1) {
        bot.sendMessage(channelID, 'You have to add a link to your command.');

        return false;
    }

    // Extract YouTube ID
    const youtubeID = extractYouTubeID(url, channelID);
    if (!youtubeID) {
        return false;
    }

    // Fetch meta data from YouTube video
    fetchVideoInfo(youtubeID, function(error, videoInfo) {
        if (error) {
            console.error(error, youtubeID);
            bot.sendMessage(channelID, 'This seems to be an invalid link.');
            return false;
        }

        // Check length of video
        let maxLength = getConfig()['music-bot'].maxLength;
        if (maxLength && isNaN(maxLength)) {
            console.log(chalk.styles.red.open + 'The max length of a song defined in your "config.json" is invalid. Therefore the download of ' + chalk.styles.red.close + videoInfo.url + chalk.styles.red.open + ' will be stopped.' + chalk.styles.red.close);
            bot.sendMessage(channelID, 'The max length of a song defined in your "config.json" is invalid. Therefore the download will be stopped.');
            return false;
        } else if (Math.ceil(maxLength) === 0) {

        } else if (videoInfo.duration / 60 > Math.ceil(maxLength)) {
            bot.sendMessage(channelID, 'The video is too long. Only videos up to ' + Math.round(maxLength) + ' minutes are allowed.');
            return false;
        } else if (videoInfo.duration / 60 > 15) {
            bot.sendMessage(channelID, 'The video is too long. Only videos up to 15 minutes are allowed.');
            return false;
        }

        // Create download directory
        mkdirp(getConfig()['music-bot'].library ? getConfig()['music-bot'].library + '/youtube' : (os.platform() === 'win32' ? 'C:/Windows/Temp/youtube' : '/tmp/youtube'), function(error) {
            if (error) {
                console.error(error);
                bot.sendMessage(channelID, 'There was a problem with downloading the video. Check out terminal of the bot to get more information.');
                return false;
            }

            // Check if already downloaded
            fs.access((getConfig()['music-bot'].library ? getConfig()['music-bot'].library + '/youtube' : (os.platform() === 'win32' ? 'C:/Windows/Temp/youtube' : '/tmp/youtube')) + '/' + videoInfo.videoId + '.mp3', fs.F_OK, function(error) {
                if (error) {
                    bot.sendMessage(channelID, 'Downloading the requested video ...');

                    downloadQueue['yt:' + videoInfo.videoId] = {
                        channelID,
                    };

                    // Download the requested song
                    YD.download(videoInfo.videoId, videoInfo.videoId + '.mp3');
                } else {
                    // Add the song to the playlist
                    playlist.push({
                        youtubeID: videoInfo.videoId,
                        url: videoInfo.url,
                        title: videoInfo.title,
                        file: getConfig()['music-bot'].library + '/youtube/' + videoInfo.videoId + '.mp3',
                    });

                    bot.sendMessage(channelID, '`' + videoInfo.title + '` added to the playlist. Position: ' + playlist.length);
                }
            });
        });
    });
}

function removeCommand(_message) { let message = _message.content; let serverID = _message.channel.server.id; let user = _message.sender; let userID = _message.sender.id; let channelID = _message.channel.id;
    const url = message.split(' ')[0];

    if (url.length < 1) {
        bot.sendMessage(channelID, 'You have to add a link to your command.');

        return false;
    }

    // Extract YouTube ID
    const youtubeID = extractYouTubeID(url, channelID);
    if (!youtubeID) {
        return false;
    }

    playlist = playlist.filter(function(element) { return element.youtubeID !== youtubeID; });

    bot.sendMessage(channelID, 'Successfully removed from the playlist.');
}

function skipCommand(_message) { let message = _message.content; let serverID = _message.channel.server.id; let user = _message.sender; let userID = _message.sender.id; let channelID = _message.channel.id;
    // Check if the bot is in a voice channel
    if (voiceChannelID) {
        if (usersWantToSkip.indexOf(userID) === -1) {
            usersWantToSkip.push(userID);
        }

        const skipLimit = getConfig()['music-bot'].skipLimit ? getConfig()['music-bot'].skipLimit : 1;
        if (usersWantToSkip.length >= skipLimit) {
            bot.getAudioContext({channel: voiceChannelID, stereo: true}, function(stream) {
                stream.stopAudioFile();
                currentSong = null;
                bot.setPresence({
                    game: null,
                });

                setTimeout(function() {
                    playLoop(channelID);
                }, 2000);
            });
        } else {
            bot.sendMessage(channelID, 'You need ' + (skipLimit - usersWantToSkip.length) + ' more to skip the current song.');
        }
    } else {
        bot.sendMessage(channelID, 'The bot is not in a voice channel.');
    }
}

function leave(serverID) {
    // if (bot.servers[serverID].members[bot.id].voice_channel_id) {
    //     bot.leaveVoiceChannel(bot.servers[serverID].members[bot.id].voice_channel_id);
    // }

    // Leaves every voice channel.
    // It's needed to loop over all channels, because after a reconnect the previous voice channel is unknown

    const channels = bot.servers[serverID].channels;
    for (let i = 0; i < channels.length; i++) {
      if (channels[i].type === 'voice') {
          bot.leaveVoiceChannel(channels[i].id);
      }
    }
}

function enter(_message, message, isID, callback) {
    let serverID;
    if (_message === null)
      serverID = null;
    else {
      serverID = _message.channel.server.id;
      for (let _id = 0; _id < bot.servers.length; _id++) {
        if (bot.servers[_id].id === _message.channel.server.id) {
          serverID = _id;
          return;
        }
      }
    }
    if (isID) {
        leave(serverID);
        bot.joinVoiceChannel(message);
        return true;
    }

    let notFound = true;
    // Look for the ID of the requested channel
    
    if (serverID === null) {
      for (let _id = 0; _id < bot.servers.length; _id++) {
        for (let id = 0; id < bot.servers[_id].channels.length; id++) {
          const channel = bot.servers[_id].channels[id];

          if (channel !== undefined && channel.name === message && channel.type === 'voice') {
            voiceChannelID = channel.id;
            notFound = false;
            serverID = _id;
            break;
          }
        }
        if (!notFound) break;
      }
    } else {
      for (let id = 0; id < bot.servers[serverID].channels.length; id++) {
        const channel = bot.servers[serverID].channels[id];

        if (channel.name === message && channel.type === 'voice') {
            voiceChannelID = channel.id;
            notFound = false;
            return;
        }
      }
    }

    if (notFound) {
        callback();
    } else {
        leave(serverID);
        bot.joinVoiceChannel(voiceChannelID);
    }
}

bot.on('ready', function() {
    if (getConfig()['music-bot'].autoJoinVoiceChannel && getConfig()['music-bot'].autoJoinVoiceChannel.length > 0) {
        enter(null, getConfig()['music-bot'].autoJoinVoiceChannel, false, function() {
            console.log(chalk.red('The voice channel defined in autoJoinVoiceChannel could not be found.'));
        });
    }
});

function enterCommand(_message, suffix) { let message = _message.content; let serverID = _message.channel.server.id; let user = _message.sender; let userID = _message.sender.id; let channelID = _message.channel.id;
    let isID = false;
    if (
        suffix.length < 1 &&
        bot.servers[serverID].members[userID].voice_channel_id
    ) {
        isID = true;
        suffix = bot.servers[serverID].members[userID].voice_channel_id;
    } else if (suffix.length < 1) {
        bot.sendMessage(channelID, 'You have to add the channel name which the bot should join.');
        return false;
    }

    enter(_message, suffix, isID, function() {
        bot.sendMessage(channelID, 'There is no channel named ' + suffix + '.');
    });
}

function playCommand(_message) { let message = _message.content; let serverID = _message.channel.server.id; let user = _message.sender; let userID = _message.sender.id; let channelID = _message.channel.id;
    if (!voiceChannelID) {
        bot.sendMessage(channelID, 'The bot is not in a voice channel.');
    } else if (playlist.length <= 0) {
        bot.sendMessage(channelID, 'There are currently no entries on the playlist.');
    } else {
        playLoop(channelID);
    }
}

function stopCommand() {
    bot.getAudioContext({channel: voiceChannelID, stereo: true}, function(stream) {
        stream.stopAudioFile();
        currentSong = null;
        bot.setPresence({
            game: null,
        });
    });
}

function currentCommand(_message) { let message = _message.content; let serverID = _message.channel.server.id; let user = _message.sender; let userID = _message.sender.id; let channelID = _message.channel.id;
    // Check if a song is playing
    if (currentSong) {
        bot.sendMessage(channelID, 'Currently playing: ' + currentSong.url);
    } else {
        bot.sendMessage(channelID, 'There is currently nothing playing.');
    }
}

function playlistCommand(_message) { let message = _message.content; let serverID = _message.channel.server.id; let user = _message.sender; let userID = _message.sender.id; let channelID = _message.channel.id;
    // Check if there are songs on the playlist
    if (playlist.length < 1) {
        bot.sendMessage(channelID, 'There are currently no entries on the playlist.');
    } else {
        let string = '';
        for (const song of playlist) {
            string += ', ' + song.url;
        }
        string = string.substring(1);
        bot.sendMessage(channelID, 'Current playlist: ' + string);
    }
}

module.exports = {
    name: 'music-bot',
    defaultCommandPrefix: 'music',
    commands: {
        "music-add": {
            fn: addCommand,
            description: 'Adds a song to the playlist',
            synonyms: [
                'music-new',
            ],
        },
        "music-remove": {
            fn: removeCommand,
            description: 'Removes a song from the playlist',
        },
        "music-skip": {
            fn: skipCommand,
            description: 'Skips the current song',
        },
        "music-enter": {
            fn: enterCommand,
            description: 'Let the bot enter a voice channel',
            synonyms: [
                'music-join',
            ],
        },
        "music-play": {
            fn: playCommand,
            description: 'Starts the playlist',
            synonyms: [
                'music-start',
            ],
        },
        "music-stop": {
            fn: stopCommand,
            description: 'Stops the playlist',
        },
        "music-current": {
            fn: currentCommand,
            description: 'Displays the current song',
            synonyms: [
                'music-now',
            ],
        },
        "music-playlist": {
            fn: playlistCommand,
            description: 'Displays all songs on the playlist',
        },
    },
};