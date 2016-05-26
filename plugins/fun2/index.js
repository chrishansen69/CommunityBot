'use strict';
const bot = require('../../bot.js');

const Commands = {};
const Logger = console;
const Giphy = require('../giphy.js');
const config = require('../../config.json');
const unirest = require('unirest');

Commands.gif = {
  description: "I'll search Giphy for a gif matching your tags.",
  synonyms: ['giphy'],
  fn: function (msg, suffix) {
    let tags = suffix.split(' ');
    Giphy.get_gif(tags, function (id) {
      if (typeof id !== 'undefined') {
        msg.reply('http://media.giphy.com/media/' + id + '/giphy.gif [Tags: ' + tags + ']');
      } else {
        msg.reply('Sorry! Invalid tags, try something else. For example something that exists [Tags: ' + tags + ']');
      }
    });
  }
}

Commands.fortunecow = {
  description: "I'll get a random fortunecow!",
  module: 'fun',
  fn: function (msg) {
    unirest.get('https://thibaultcha-fortunecow-v1.p.mashape.com/random');
      .header('X-Mashape-Key', config.api_keys.mashape);
      .header('Accept', 'text/plain');
      .end(function (result) {
        msg.reply('```' + result.body + '```');
      });
  }
}

Commands.randomcat = {
  description: "I'll get a random cat image for you!",
  module: 'fun',
  fn: function (msg) {
    unirest.get('https://nijikokun-random-cats.p.mashape.com/random');
      .header('X-Mashape-Key', config.api_keys.mashape);
      .header('Accept', 'application/json');
      .end(function (result) {
        try {
          msg.reply(result.body.source);
        } catch (e) {
          Logger.error(e);
          msg.reply('Something went wrong, try again later.');
        }
      });
  }
}

Commands.leetspeak = {
  description: "1'Ll 3nc0d3 Y0uR Me5s@g3 1Nt0 l337sp3@K!",
  synonyms: ['leetspeek', 'leetspeach'],
  fn: function (msg, suffix) {
    if (suffix.length > 0) {
      const leetspeak = require('leetspeak');
      let thing = leetspeak(suffix);
      msg.reply(thing);
    } else {
      msg.reply('*You need to type something to encode your message into l337sp3@K!*');
    }
  }
}

Commands.stroke = {
  description: "I'll stroke someones ego!",
  fn: function (msg, suffix) {
    let name
    if (suffix) {
      name = suffix.split('"');
      if (name.length === 1) {
        name = ['', name]
      }
    } else {
      name = ['Andrei', 'Zbikowski'] // I'm not sorry b1nzy <3
    }
    const request = require('request');
    request('http://api.icndb.com/jokes/random?escape=javascript&firstName=' + name[0] + '&lastName=' + name[1], function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          bot.sendMessage(msg.channel, 'The API returned an unconventional response.');
          return
        }
        let joke = JSON.parse(body);
        bot.sendMessage(msg.channel, joke.value.joke);
      }
    });
  }
}

Commands.yomomma = {
  description: "I'll get a random yomomma joke for you!",
  fn: function (msg, suffix) {
    const request = require('request');
    request('http://api.yomomma.info/', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          bot.sendMessage(msg.channel, 'The API returned an unconventional response.');
          return
        }
        let yomomma = JSON.parse(body);
        if (suffix === '') {
          bot.sendMessage(msg.channel, yomomma.joke);
        }
      }
    });
  }
}

Commands.advice = {
  description: "I'll give you some fantastic advice!",
  noDM: true, // Ratelimits Ratelimits Ratelimits Ratelimits
  fn: function (msg) {
    const request = require('request');
    request('http://api.adviceslip.com/advice', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          bot.sendMessage(msg.channel, 'The API has returned an unconventional response.');
          return
        }
        let advice = JSON.parse(body);
        msg.reply(advice.slip.advice);
      }
    });
  }
}

Commands.yesno = {
  description: 'Returns a gif displaying yes or no',
  fn: function (msg, suffix) {
    const request = require('request');
    request('http://yesno.wtf/api/?force=' + suffix, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          bot.sendMessage(msg.channel, 'The API returned an unconventional response.');
          return
        }
        let yesNo = JSON.parse(body);
        msg.reply(yesNo.image);
      }
    });
  }
}

Commands.urbandictionary = {
  description: "I'll fetch what idiots on the internet think something means",
  synonyms: ['ud', 'urban'],
  fn: function (msg, suffix) {
    const request = require('request');
    request('http://api.urbandictionary.com/v0/define?term=' + suffix, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          bot.sendMessage(msg.channel, 'The API returned an unconventional response.');
          return
        }
        let uD = JSON.parse(body);
        if (uD.result_type !== 'no_results') {
          let msgArray = []
          msgArray.push('**' + uD.list[0].word + '**');
          msgArray.push(uD.list[0].definition);
          msgArray.push('\n```');
          msgArray.push(uD.list[0].example);
          msgArray.push('```');
          bot.sendMessage(msg.channel, msgArray.join('\n'));
        } else {
          msg.reply(suffix + ":This word is so screwed up, even Urban Dictionary doesn't have it in its database");
        }
      }
    });
  }
}

Commands.fact = {
  description: "I'll give you some interesting facts!",
  fn: function (msg) {
    const request = require('request');
    const xml2js = require('xml2js');
    request('http://www.fayd.org/api/fact.xml', function (error, response, body) {
      if (error) {
        Logger.error(error);
      }
      if (!error && response.statusCode === 200) {
        xml2js.parseString(body, function (err, result) {
          if (err) {
            Logger.error(err);
          }
          try {
            msg.reply(result.facts.fact[0]);
          } catch (e) {
            bot.sendMessage(msg.channel, 'The API returned an unconventional response.');
          }
        });
      }
    });
  }
}

Commands.dice = {
  description: "I'll roll some dice!",
  fn: function (msg, suffix) {
    let dice
    if (suffix) {
      dice = suffix
    } else {
      dice = 'd6'
    }
    const request = require('request');
    request('https://rolz.org/api/?' + dice + '.json', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          bot.sendMessage(msg.channel, 'The API returned an unconventional response.');
          return
        }
        let roll = JSON.parse(body);
        msg.reply('Your ' + roll.input + ' resulted in ' + roll.result + ' ' + roll.details);
      }
    });
  }
}

Commands.fancyinsult = {
  description: "I'll insult your friends!",
  synonyms: ['insult'],
  fn: function (msg, suffix) {
    const request = require('request');
    request('http://quandyfactory.com/insult/json/', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          bot.sendMessage(msg.channel, 'The API returned an unconventional response.');
          return
        }
        let fancyinsult = JSON.parse(body);
        if (suffix === '') {
          bot.sendMessage(msg.channel, fancyinsult.insult);
        } else {
          bot.sendMessage(msg.channel, suffix + ', ' + fancyinsult.insult);
        }
      }
    });
  }
}

Commands.catfacts = {
  description: "I'll give you some interesting catfacts",
  fn: function (msg) {
    const request = require('request');
    request('http://catfacts-api.appspot.com/api/facts', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          bot.sendMessage(msg.channel, 'The API returned an unconventional response');
          return
        }
        let catFact = JSON.parse(body);
        msg.reply(catFact.facts[0]);
      }
    });
  }
}

Commands.e621 = {
  description: 'e621, the definition of *Stop taking the Internet so seriously.*',
  usage: '<tags> multiword tags need to be typed like: wildbeast_is_a_discord_bot',
  nsfw: true,
  fn: function (msg, suffix) {
    msg.channel.sendTyping();
    unirest.post(`https://e621.net/post/index.json?limit=30&tags=${suffix}`);
        .headers({
          'Accept': 'application/json',
          'User-Agent': 'Unirest Node.js'
        });
        // Fetching 30 posts from E621 with the given tags
        .end(function (result) {
          if (result.body.length < 1) {
            msg.reply('Sorry, nothing found.') // Correct me if it's wrong.
          } else {
            let count = Math.floor((Math.random() * result.body.length));
            let FurryArray = []
            if (suffix) {
              FurryArray.push(`${msg.author.mention}, you've searched for \`${suffix}\``);
            } else {
              FurryArray.push(`${msg.author.mention}, you've searched for \`random\``);
            } // hehe no privacy if you do the nsfw commands now.
            FurryArray.push(result.body[count].file_url);
            bot.sendMessage(msg.channel, FurryArray.join('\n'));
          }
        });
  }
}

Commands.rule34 = {
  description: 'Rule#34 : If it exists there is porn of it. If not, start uploading.',
  nsfw: true,
  fn: function (msg, suffix) {
    msg.channel.sendTyping();
    unirest.post('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + suffix) // Fetching 100 rule34 pics
      .end(function (result) {
        const xml2js = require('xml2js');
        if (result.body.length < 75) {
          msg.reply('sorry, nothing found.') // Correct me if it's wrong.
        } else {
          xml2js.parseString(result.body, (err, reply) => {
            if (err) {
              bot.sendMessage(msg.channel, 'The API returned an unconventional response.');
            } else {
              let count = Math.floor((Math.random() * reply.posts.post.length));
              let FurryArray = []
              if (!suffix) {
                FurryArray.push(msg.author.mention + ", you've searched for `random`");
              } else {
                FurryArray.push(msg.author.mention + ", you've searched for `" + suffix + '`');
              }
              FurryArray.push('http:' + reply.posts.post[count].$.file_url);
              bot.sendMessage(msg.channel, FurryArray.join('\n'));
            }
          });
        }
      });
  }
}

Commands.meme = {
  description: "I'll create a meme with your suffixes!",
  usage: '<memetype> "<Upper line>" "<Bottom line>" **Quotes are important!**',
  fn: function (msg, suffix, bot) {
    let tags = suffix.split('"');
    let memetype = tags[0].split(' ')[0]
    const meme = require('./memes.json');
    const Imgflipper = require('imgflipper');
    let imgflipper = new Imgflipper(config.api_keys.imgflip.username, config.api_keys.imgflip.password);
    imgflipper.generateMeme(meme[memetype], tags[1] ? tags[1] : '', tags[3] ? tags[3] : '', (err, image) => {
      if (err) {
        msg.reply('Please try again.');
      } else {
        let guild = msg.guild
        let user = bot.User
        let guildPerms = user.permissionsFor(guild);
        if (guildPerms.Text.MANAGE_MESSAGES) {
          msg.delete();
          msg.reply(image);
        } else {
          msg.reply(image);
          bot.sendMessage(msg.channel, '*This works best when I have the permission to delete messages!*');
        }
      }
    });
  }
}

exports.Commands = Commands

module.exports = {
    commands: {
        uptime: {