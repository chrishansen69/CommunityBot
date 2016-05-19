'use strict';

let upvote = 0;
let downvote = 0;
let voter = [];
let votebool = false;
let topicstring = "";

const config = require('./config.json');
const bot = require('./bot.js');

exports.commands = {
  "ping": {
    process: function(message) {
      bot.sendMessage(message.channel, "PONG");
    }
  },
  "newvote": {
    process: function(msg, suffix) {
      if (!suffix) { bot.sendMessage(msg.channel, "Include a suffix please!"); return; }
      if (votebool == true) { bot.sendMessage(msg, "Theres already a vote pending!"); return; }
      topicstring = suffix;
      bot.sendMessage(msg, "New Vote started: `" + suffix + "`\nTo vote say `" + AuthDetails.discordjs_trigger + "vote +/-`");
      votebool = true;
    }
  },
  "vote": {
    process: function(msg, suffix) {
      if (!suffix) { bot.sendMessage(msg, "Gotta vote for something!"); return; }
      if (votebool == false) { bot.sendMessage(msg, "There is not a vote in progress. Start one with the 'newvote' command."); return; }
      if (voter.indexOf(msg.author) != -1) { return; }
      voter.push(msg.author);
      var vote = suffix.split(" ")[0]
      if (vote == "+" || vote == "y" || vote == "yes") { upvote += 1; }
      else if (vote == "-" || vote == "n" || vote == "no") { downvote += 1; }
    }
  },
  "votestatus": {
    process: function(msg) {
      var msgArray = [];
      if (votebool == true) {bot.sendMessage(msg.channel, "There **is** a vote in progress. Error reading topic string.")}
        else {
          bot.sendMessage(msg.channel, "There is currently **not** a vote in progress.")
        }
    }
  },
  "endvote": {
    process: function(msg, suffix) {
      bot.sendMessage(msg, "**Results of last vote:**\nTopic: `" + topicstring + "`\nVotes for: `" + upvote + "`\nVotes against: `" + downvote + "`");
      upvote = 0;
      downvote = 0;
      voter = [];
      votebool = false;
      topicstring = "";
    }
  },
  "ping": {
    process: function(message) {
      bot.sendMessage(message.channel, "PONG");
    }
  },
  "pong": {
    process: function(message) {
      bot.sendMessage(message.channel, "PING");
    }
  },
  "setgame": {
    process: function(msg, suffix) {
      bot.setStatus('online', "Prefix: = Playing: " + suffix);
      bot.sendMessage(msg.channel, "Done! Now playing: " + suffix)
    }
  },
  "setgame-idle": {
    process: function(msg, suffix) {
      bot.setStatus('idle', "Prefix: = Playing: " + suffix);
      bot.sendMessage(msg.channel, "Done! Now playing: " + suffix + "Idle!")
    }
  },
  "johncena": {
    process: function(msg, suffix) {
      bot.sendMessage(msg.channel, " **AND HIS NAME IS** https://www.youtube.com/watch?v=4k1xY7v8dDQ");
    }
  },
  "join": {
    process: function(message, suffix) {
      let query = suffix;
      let sender = message.author.username;
      if (!query) {
        bot.sendMessage(message.channel, "Please specify an invite link.");
        return;
      }
      let invite = message.content.split(" ")[1];
      bot.joinServer(invite, function(error, server) {
        if (error) {
          bot.sendMessage(message.channel, "Something went wrong. Error code: " + error);
        } else {
          bot.sendMessage(message.channel, "Great! I just joined: " + server);
          let messageArray = [];
          messageArray.push("Hi! I'm **" + bot.user.username + "**. I was invited to this server by " + message.author + ".");
          messageArray.push("You can use `" + trigger + "help` to see what I can do.");
          messageArray.push("If you don't want me here, please use the " + AuthDetails.discordjs_trigger + "leave command to get me out.");
          bot.sendMessage(server.defaultChannel, messageArray);
          console.log("Joined server: " + server)
        }
      });
    }
  },
  "hello": {
    process: function(message) {
      bot.sendMessage(message.channel, "Hello there! I am CommunityBot, a bot made entirely by the community! Check out my innards here: https://github.com/OneMansGlory/CommunityBot.git . You can check out what I can do with my help command!")
    }
  },
  "eval": {
    process: function(message, suffix) {
      let evalWhitelist = require('./evalwhitelist.json');
      if (evalWhitelist.indexOf(message.sender.id) > -1) {
        try {
          bot.sendMessage(message, eval(suffix));
        } catch (err) {
					let array = [];
          array.push("*Eval failed.*");
					array.push('```');
					array.push(err);
          array.push(err.stack);
					array.push('```');
					bot.sendMessage(message, array);
        }
      } else {
        bot.sendMessage(message, "No permission!");
      }
    }
  },
  "help": {
    process: function(message) {
      bot.sendMessage(message.channel, "Currently, I am in prealpha stages, and all I can do is respond to ping, pong, hello, and help.")
    }
  },
  "spam": {
    process: function(message) {
      bot.sendMessage(message.channel, ":warning: keep it in the #spam fam :warning:")
    }
  },
  "permtest": {
	process: function(message) {
		if (message.channel.permissionsOf(message.sender).hasPermission("kickMembers")) {
			bot.sendMessage(message.channel, ":warning: " + message.sender.name + " has permission to kick users");
		} else {
			bot.sendMessage(message.channel, ":warning: " + message.sender.name + " does **not** have permission to kick users");
		}
	}
  }
};
