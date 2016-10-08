'use strict';

// Discord Bot API
const bot = require('../../bot.js');
const utility = require('../../utility.js');

module.exports = {
  name: 'bare-minimum',
  defaultCommandPrefix: 'bare-minimum',
  commands: {
    // The bare minimum you need.
    'ping': {
      fn: function(message) {
        message.channel.sendMessage('PONG ' + message.author.toString());
      },
      description: 'Ping?'
    },
    'pong': {
      fn: function(message) {
        message.channel.sendMessage('PING ' + message.author.toString());
      },
      description: 'Pong!'
    },
    'me': {
      fn: function(message) {
        message.channel.sendMessage("Your ID: '" + message.author.id + "'");
      },
      description: 'Messages your user ID.'
    },
    'countchannels': {
      fn: function(message) {
        message.channel.sendMessage('This bot is serving in ' + bot.channels.size + ' channels.');
      },
      description: 'Count how many channels the bot is serving in.'
    },
    'help': {
      fn: function(message) {
        const config = utility.config;

        // this tries to print 3729+ chars. the max is 2000.
        // what do we do about that? we gotta split it into pages.
        
        //console.log('hiiii');
        const tr = '\u200b' + config.trigger;
        const tcmds = ['Here are my commands: ', ''];

        // load plugin commands

        const loadPlugins = require('../../plugins.js');
        if (config.plugins && config.plugins.length > 0) {
          const plugins = loadPlugins(config.plugins);
          
          
          Object.keys(plugins).forEach(function(i) {
            const plugin = plugins[i];
            
            Object.keys(plugin.commands).forEach(function(name) {
              const command = plugin.commands[name];
              
              //utility.registerCommand(name, command.fn, command.description); // register
              let str = tr + name;

              // synonyms
              if (command.synonyms) {
                command.synonyms.forEach(function(aliasName) {
                  //utility.registerCommand(aliasName, command.fn); // register
                  str += ' / ' + tr + aliasName;
                });
              }

              // description
              str += ' - ' + (command.description || '*No description available.*');

              tcmds.push(str);
            });
          });
        }

        // load user commands
        if (utility.xdata.customCommands) {
          for (const i of utility.xdata.customCommands) {
            tcmds.push(tr + i.name + ' - User-created command');
            //utility.registerEval(i.name, i.action);
          }
        }

        // split the message and send
        if (tcmds.join('\n').length >= 1900) {
          let left = tcmds.length;
          
          while (left > 40) {
            message.author.sendMessage(tcmds.slice(left - 40, left));
            left -= 40;
          }
          
          message.author.sendMessage(tcmds.slice(0, left));
          
        } else {
          message.author.sendMessage(tcmds);
        }
        
        
        //console.log('bye');
      },
      description: 'Shows you this list of commands.'
    },
    'hello': {
      fn: function(message) {
        message.channel.sendMessage("Hello Expand Dong. I'm a bot made by rafa1231518, based on https://github.com/OneMansGlory/CommunityBot.git . You can check out what I can do with my help command!");
      },
      description: 'Shows you a little message.'
    },
    // Voting
    'newvote': {
      fn: function(msg, suffix) {
        if (!suffix) { msg.channel.sendMessage('Include a vote message please!'); return; }

        const chan = utility.getPseudoChannel(msg.channel);
        if (chan.votebool) { msg.channel.sendMessage("There's already a vote pending!"); return; }

        chan.upvote = 0;
        chan.downvote = 0;
        chan.voter = [];
        chan.votebool = true;
        chan.topicstring = suffix;
        chan.voteStarterId = msg.author.id;

        msg.channel.sendMessage('New Vote started: `' + suffix + '`\nTo vote say `' + utility.config.trigger + 'vote +/-`');
      },
      description: 'Start a vote.'
    },
    'vote': {
      fn: function(msg, suffix) {
        if (!suffix) { msg.channel.sendMessage('Gotta vote for something!'); return; }

        const chan = utility.getPseudoChannel(msg.channel);
        if (!chan.votebool) { msg.channel.sendMessage('There are no votes in progress. Start one with the `' + utility.config.trigger + 'newvote` command.'); return; }
        if (chan.voter.indexOf(msg.author.id) != -1) { return; }

        chan.voter.push(msg.author.id);

        const vote = suffix.split(' ')[0];
        if (vote == '+' || vote == 'y' || vote == 'yes') {
          chan.upvote++;
        } else if (vote == '-' || vote == 'n' || vote == 'no') {
          chan.downvote++;
        }
      },
      description: 'Vote in a... vote?'
    },
    'votestatus': {
      fn: function(msg) {
        const chan = utility.getPseudoChannel(msg.channel);

        if (chan.votebool) {
          msg.channel.sendMessage('A vote is currently in progress: "' + chan.topicstring + '"');
        } else {
          msg.channel.sendMessage('A vote is **not** currently in progress.');
        }
      },
      description: 'Tells you whether or not there is a vote in progress.'
    },
    'endvote': {
      fn: function(msg) {
        const chan = utility.getPseudoChannel(msg.channel);

        if (!utility.isOpped(msg.author) && msg.author.id !== chan.voteStarterId) { msg.channel.sendMessage('Only bot operators or the vote starter can end a vote!'); return; }
        
        msg.channel.sendMessage('**Results of last vote:**\nTopic: `' + chan.topicstring + '`\nVotes for: `' + chan.upvote + '`\nVotes against: `' + chan.downvote + '`');

        chan.upvote = 0;
        chan.downvote = 0;
        chan.voter = [];
        chan.votebool = false;
        chan.topicstring = '';
        chan.voteStarterId = -1;
      },
      description: 'Ends a started vote.'
    },
  },
};