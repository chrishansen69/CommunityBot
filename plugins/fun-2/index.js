'use strict';

// pretty much completely stolen from SteamingMutt/WildBeast, with a few edits
// so credit where credit's due

const utility = require('../../utility.js');

const Giphy = require('./giphy.js');
const leetspeak = require('../../lib/leetspeak.js');
const unirestHelper = require('../../lib/unirest-helper.js');

const unirest = require('unirest');
const request = require('request');
const xml2js = require('../../lib/xml2js');
const Imgflipper = require('imgflipper');

const meme = require('./memes.json');

/*

    "csgo-market": "^1.5.2",
    "discordie": "^0.6.2",
    "imgflipper": "^1.0.1",
    "inquirer": "^0.12.0",
    "leetspeak": "0.0.1",
    "minimist": "^1.2.0",
    "nedb": "^1.8.0",
    "ora": "^0.2.1",
    "request": "^2.72.0",
    "require-directory": "^2.1.1",
    "semver": "^5.1.0",
    "unirest": "^0.4.2",
    "winston": "^2.2.0",
    "winston-daily-rotate-file": "^1.0.1",
    "xml2js": "^0.4.16",
    "youtube-api": "^2.0.2",
    "youtube-dl": "^1.11.1"

*/

(function() {
  const config = utility.config;

  if (!config.fun2) {
    config.fun2 = {};
    config.fun2.apiKeys = {};
    config.fun2.apiKeys.mashape = '';
    
    config.fun2.apiKeys.imgflip = {};
    
    config.fun2.apiKeys.imgflip.username = '';
    config.fun2.apiKeys.imgflip.password = '';
  } else {
    if (!config.fun2.apiKeys) {
      config.fun2.apiKeys = {};
    }
    if (!config.fun2.apiKeys.mashape) {
      config.fun2.apiKeys.mashape = '';
    }
    if (!config.fun2.apiKeys.imgflip) {
      config.fun2.apiKeys.imgflip = {};
    }
    if (!config.fun2.apiKeys.imgflip.username) {
      config.fun2.apiKeys.imgflip.username = '';
    }
    if (!config.fun2.apiKeys.imgflip.password) {
      config.fun2.apiKeys.imgflip.password = '';
    }
  }
})();

module.exports = {
  commands: {}
};

module.exports.commands.gif = {
  description: "I'll search Giphy for a gif matching your tags.",
  synonyms: ['giphy'],
  fn: function(msg, suffix) {
    const tags = suffix.split(' ');
    Giphy.get_gif(tags, function(id) {
      if (typeof id !== 'undefined') {
        msg.reply('http://media.giphy.com/media/' + id + '/giphy.gif [Tags: ' + tags + ']');
      } else {
        msg.reply('Sorry! Invalid tags, try something else. For example something that exists [Tags: ' + tags + ']');
      }
    });
  }
};

module.exports.commands.fortunecow = {
  description: "I'll get a random fortunecow!",
  synonyms: ['cow'],
  fn: function(msg) {
    unirestHelper.getMashape('https://thibaultcha-fortunecow-v1.p.mashape.com/random', utility.config.fun2.apiKeys.mashape, 'text/plain', function(result) {
        msg.reply('```' + result.body + '```');
      });
  }
};

module.exports.commands.randomcat = {
  description: "I'll get a random cat image for you!",
  synonyms: ['cat'],
  fn: function(msg) {
    unirestHelper.getMashape('https://nijikokun-random-cats.p.mashape.com/random', utility.config.fun2.apiKeys.mashape, 'application/json', function(result) {
        try {
          msg.reply(result.body.source);
        } catch (e) {
          console.error(e);
          msg.reply('Something went wrong, try again later.');
        }
      });
  }
};

module.exports.commands.leetspeak = {
  description: "1'Ll 3nc0d3 Y0uR Me5s@g3 1Nt0 l337sp3@K!",
  synonyms: ['leetspeek', 'leetspeach'],
  fn: function(msg, suffix) {
    if (suffix.length > 0) {
      const thing = leetspeak(suffix);
      msg.reply(thing);
    } else {
      msg.reply('*You need to type something to encode your message into l337sp3@K!*');
    }
  }
};

module.exports.commands.stroke = {
  description: "I'll stroke someone's ego!",
  fn: function(msg, suffix) {
    let name;
    if (suffix) {
      name = suffix.split('"');
      if (name.length === 1) {
        name = ['', name];
      }
    } else {
      name = ['Simplicity', 'NFM'];
    }
    request('http://api.icndb.com/jokes/random?escape=javascript&firstName=' + name[0] + '&lastName=' + name[1], function(error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          msg.channel.sendMessage('The API returned an unconventional response.');
          return;
        }
        const joke = JSON.parse(body);
        msg.channel.sendMessage(joke.value.joke);
      }
    });
  }
};

module.exports.commands.yomomma = {
  description: "I'll get a random yomomma joke for you!",
  fn: function(msg, suffix) {
    request('http://api.yomomma.info/', function(error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          msg.channel.sendMessage('The API returned an unconventional response.');
          return;
        }
        const yomomma = JSON.parse(body);
        if (suffix === '') {
          msg.channel.sendMessage(yomomma.joke);
        }
      }
    });
  }
};

module.exports.commands.advice = {
  description: "I'll give you some fantastic advice!",
  fn: function(msg) {
    request('http://api.adviceslip.com/advice', function(error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          msg.channel.sendMessage('The API has returned an unconventional response.');
          return;
        }
        const advice = JSON.parse(body);
        msg.reply(advice.slip.advice);
      }
    });
  }
};

module.exports.commands.yesno = {
  description: 'Returns a gif displaying yes or no',
  fn: function(msg, suffix) {
    request('http://yesno.wtf/api/?force=' + suffix, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          msg.channel.sendMessage('The API returned an unconventional response.');
          return;
        }
        const yesNo = JSON.parse(body);
        msg.reply(yesNo.image);
      }
    });
  }
};

module.exports.commands.urbandictionary = {
  description: "I'll fetch what idiots on the internet think something means",
  synonyms: ['ud', 'urban'],
  fn: function(msg, suffix) {
    request('http://api.urbandictionary.com/v0/define?term=' + suffix, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          msg.channel.sendMessage('The API returned an unconventional response.');
          return;
        }
        const uD = JSON.parse(body);
        if (uD.result_type !== 'no_results') {
          const msgArray = [];
          msgArray.push('**' + uD.list[0].word + '**');
          msgArray.push(uD.list[0].definition);
          msgArray.push('\n```');
          msgArray.push(uD.list[0].example);
          msgArray.push('```');
          msg.channel.sendMessage(msgArray.join('\n'));
        } else {
          msg.reply('`' + suffix + "` is so fucked up, even Urban Dictionary doesn't have it in its database");
        }
      }
    });
  }
};

module.exports.commands.fact = {
  description: "I'll give you some interesting facts!",
  fn: function(msg) {
    request('http://www.fayd.org/api/fact.xml', function(error, response, body) {
      if (error) {
        console.error(error);
      }
      if (!error && response.statusCode === 200) {
        xml2js.parseString(body, function(err, result) {
          if (err) {
            console.error(err);
          }
          try {
            msg.reply(result.facts.fact[0]);
          } catch (e) {
            msg.channel.sendMessage('The API returned an unconventional response.');
          }
        });
      }
    });
  }
};

module.exports.commands.dnd = {
  description: "I'll roll some dice!",
  synonyms: ['dnddice'],
  fn: function(msg, suffix) {
    let dice;
    if (suffix) {
      dice = suffix;
    } else {
      dice = 'd6';
    }
    request('https://rolz.org/api/?' + dice + '.json', function(error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          msg.channel.sendMessage('The API returned an unconventional response.');
          return;
        }
        const roll = JSON.parse(body);
        msg.reply('Your ' + roll.input + ' resulted in ' + roll.result + ' ' + roll.details);
      }
    });
  }
};

module.exports.commands.fancyinsult = {
  description: "I'll insult your friends!",
  synonyms: ['insult'],
  fn: function(msg, suffix) {
    request('http://quandyfactory.com/insult/json/', function(error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          msg.channel.sendMessage('The API returned an unconventional response.');
          return;
        }
        const fancyinsult = JSON.parse(body);
        if (suffix === '') {
          msg.channel.sendMessage(fancyinsult.insult);
        } else {
          msg.channel.sendMessage(suffix + ', ' + fancyinsult.insult);
        }
      }
    });
  }
};

module.exports.commands.catfacts = {
  description: "I'll give you some interesting catfacts",
  fn: function(msg) {
    request('http://catfacts-api.appspot.com/api/facts', function(error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          msg.channel.sendMessage('The API returned an unconventional response');
          return;
        }
        const catFact = JSON.parse(body);
        msg.reply(catFact.facts[0]);
      }
    });
  }
};

module.exports.commands.e621 = {
  description: 'e621, the definition of *Stop taking the Internet so seriously.*',
//  usage: '<tags> multiword tags need to be typed like: wildbeast_is_a_discord_bot',
//  nsfw: true,
  fn: function(msg, suffix) {
    //bot.startTyping(msg.channel);
    unirest.post(`https://e621.net/post/index.json?limit=30&tags=${suffix}`)
      .headers({
        'Accept': 'application/json',
        'User-Agent': 'Unirest Node.js'
      })
      // Fetching 30 posts from E621 with the given tags
      .end(function(result) {
        if (result.body.length < 1) {
          msg.reply('Sorry, nothing found.'); // Correct me if it's wrong.
        } else {
          const count = Math.floor((Math.random() * result.body.length));
          const FurryArray = [];
          if (suffix) {
            FurryArray.push(`${msg.author.toString()}, you've searched for \`${suffix}\``);
          } else {
            FurryArray.push(`${msg.author.toString()}, you've searched for \`random\``);
          } // hehe no privacy if you do the nsfw commands now.
          FurryArray.push(result.body[count].file_url);
          //bot.stopTyping(msg.channel);
          msg.channel.sendMessage(FurryArray.join('\n'));
        }
      });
  }
};

module.exports.commands.rule34 = {
  description: 'Rule 34: If it exists, there is porn of it. If not, start uploading.',
//  nsfw: true,
  synonyms: ['r34'],
  fn: function(msg, suffix) {
    //bot.startTyping(msg.channel);
    unirest.post('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + suffix) // Fetching 100 rule34 pics
      .end(function(result) {
        if (result.body.length < 75) {
          msg.reply('sorry, nothing found.'); // Correct me if it's wrong.
        } else {
          xml2js.parseString(result.body, (err, reply) => {
            if (err) {
              msg.channel.sendMessage('The API returned an unconventional response.');
            } else {
              const count = Math.floor((Math.random() * reply.posts.post.length));
              const FurryArray = [];
              if (!suffix) {
                FurryArray.push(msg.author.toString() + ", you've searched for `random`");
              } else {
                FurryArray.push(msg.author.toString() + ", you've searched for `" + suffix + '`');
              }
              FurryArray.push('http:' + reply.posts.post[count].$.file_url);
              //bot.stopTyping(msg.channel);
              msg.channel.sendMessage(FurryArray.join('\n'));
            }
          });
        }
      });
  }
};

module.exports.commands.meme = {
  description: "I'll create a meme with your suffixes!",
  ////  usage: '<memetype> "<Upper line>" "<Bottom line>" **Quotes are important!**',
  fn: function(msg, suffix, bot) {
    const tags = suffix.split('"');
    const memetype = tags[0].split(' ')[0];
    const imgflipper = new Imgflipper(utility.config.fun2.apiKeys.imgflip.username, utility.config.fun2.apiKeys.imgflip.password);
    imgflipper.generateMeme(meme[memetype], tags[1] ? tags[1] : '', tags[3] ? tags[3] : '', (err, image) => {
      if (err) {
        msg.reply('Please try again.');
      } else {
        const guild = msg.guild;
        const user = bot.User;
        const guildPerms = user.permissionsFor(guild);
        if (guildPerms.Text.MANAGE_MESSAGES) {
          bot.deleteMessage(msg);
          msg.reply(image);
        } else {
          msg.reply(image);
          msg.channel.sendMessage('*This works best when I have the permission to delete messages!*');
        }
      }
    });
  }
};

module.exports.commands.yoda = {
  description: 'Turn your sentence into Yoda-speak!',
  fn: function(msg, suffix) {
    const sf = suffix ? suffix.replace(' ', '+') : 'You+will+learn+how+to+speak+like+me+someday.++Oh+wait';
    unirestHelper.getMashape('https://yoda.p.mashape.com/yoda?sentence=' + sf, utility.config.fun2.apiKeys.mashape, 'text/plain', function(result) {
      msg.reply('```' + result.body + '```');
    });
  }
};

module.exports.commands.pokemon = {
  description: 'Get data on Pokémon!',
  synonyms: ['pkmn'],
  fn: function(msg, suffix) {
    const sf = suffix ? suffix.replace(' ', '+') : 'mew';
    unirestHelper.getMashape('https://phalt-pokeapi.p.mashape.com/pokemon/' + sf, utility.config.fun2.apiKeys.mashape, 'text/plain', function(result) {
      msg.reply('```' + result.body + '```');
    });
  }
};

/*
module.exports.commands.snapshot = {
  description: "Get a snapshot of a web page.",
  synonyms: ['savepage'],
  fn: function(msg, suffix) {
    const sf = suffix ? encodeURI(suffix) : 'http%3A%2F%2Fwww.twitter.com%2F';
    unirest.get('https://thumbnail-thumbnail-v1.p.mashape.com/get?delay=2500&url=' + sf + '&width=1024')
      .header('X-Mashape-Key', config.fun2.apiKeys.mashape)
      .end(function(result) {
        msg.channel.sendFile(result.body);
      });
  }
};
*/