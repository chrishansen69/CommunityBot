'use strict';

// Discord Bot API
const bot = require('../../bot.js');
const utility = require('../../utility.js');
const getConfig = utility.getConfig;

const request = require('request');
const chalk = require('chalk');
const uu = require('url-unshort')(); //?

const rand = require('../../lib/rand.js');
const coprolalia = require('../../lib/coprolalia.js');
const BS = require('../../lib/bullshit.js');
const bs = new BS();

const excuses = require('./excuses.json');
const superb = require('./superb.json');
const catnames = require('./catnames.json');
const maledognames = require('./maledognames.json');
const femaledognames = require('./femaledognames.json');
const superheroes = require('./superheroes.json');
const supervillains = require('./supervillains.json');
const asciifaces = require('./asciifaces.json');
const catfaces = require('./catfaces.json');
const cows = require('./cows.json');
const jokes = require('./jokes.json');

function parseDate(str) {
  if (str.indexOf('-') > -1) {
    const parts = str.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
  }
  return new Date(str);
}

module.exports = {
  name: 'hansen-fun',
  defaultCommandPrefix: 'hansen-fun',
  commands: {
    'excuse': {
      fn: function(message) {
        message.channel.sendMessage(excuses[rand(excuses.length)]);
      },
      description: 'Get an IT excuse'
    },
    'avatar': { // from brussell98/BrussellBot under MIT
      description: "Get a link to a user's avatar.",
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) {
          if (msg.author.avatarURL !== null) {
            msg.channel.sendMessage('I can only get your avatar in a direct message. Here it is: ' + msg.author.avatarURL);
            return;
          }
          if (msg.author.avatarURL === null) {
            msg.channel.sendMessage("I can only get your avatar in a direct message, but you don't have one");
            return;
          }
        }
        if (msg.mentions.length === 0 && !suffix) {
          if (msg.author.avatarURL !== null) {
            msg.channel.sendMessage(msg.author.username + "'s avatar: " + msg.author.avatarURL);
          } else {
            msg.channel.sendMessage(msg.author.username + ' has no avatar', function(erro, wMsg) {
              bot.deleteMessage(wMsg, { 'wait': 8000 }); 
            });
          }
        } else if (msg.mentions.length > 0) {
          if (msg.everyoneMentioned) {
            msg.channel.sendMessage('Nice try.', function(erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            return;
          }
          if (msg.mentions.length > 6) {
            msg.channel.sendMessage('No more than 6 users.', function(erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            return;
          }
          msg.mentions.map(function(usr) {
            if (usr.avatarURL !== null) {
              msg.channel.sendMessage('**' + usr.username.replace(/@/g, '@\u200b') + "**'s avatar: " + usr.avatarURL + '');
            } else {
              msg.channel.sendMessage('**' + usr.username + '** has no avatar', function(erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            }
          });
        } else {
          if (msg.everyoneMentioned) {
            msg.channel.sendMessage('Nice try.', function(erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            return;
          }
          const users = suffix.split(/, ?/);
          if (users.size > 6) {
            msg.channel.sendMessage('No more than 6 users.', function(erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            return;
          }
          users.map(function(user) {
            const usr = msg.channel.guild.members.get('username', user);
            if (usr) {
              if (usr.avatarURL !== null) {
                msg.channel.sendMessage('**' + usr.username.replace(/@/g, '@\u200b') + "**'s avatar: " + usr.avatarURL + '');
              } else {
                msg.channel.sendMessage('**' + usr.username + '** has no avatar', function(erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
              }
            } else {
              msg.channel.sendMessage('User "' + user + '" not found. If you want to get the avatar of multiple users separate them with a comma.', function(erro, wMsg) {
                bot.deleteMessage(wMsg, { 'wait': 20000 }); 
              }); 
            }
          });
        }
      }
    },
    'strawpoll': {
      description: 'Create a strawpoll',
  //  usage: "<option1>, <option2>, [option3], ...",
      fn: function(msg, suffix) {
        if (suffix && /^[^, ](.*), ?(.*)[^, ]$/.test(suffix)) {
          suffix = msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).split(/, ?/);
          request.post({
              url: 'https://strawpoll.me/api/v2/polls',
              headers: {'content-type': 'application/json'},
              json: true,
              body: {
                'title': '' + msg.author.username + "'s Poll",
                'options': suffix
              },
              followAllRedirects: true
            }, (error, response, body) => {
              if (!error && response.statusCode == 200) msg.channel.sendMessage(msg.author.username.replace(/@/g, '@\u200b') + ' created a strawpoll. Vote here: <http://strawpoll.me/' + body.id + '>');
              else if (error) msg.channel.sendMessage(error);
              else if (response.statusCode != 200) msg.channel.sendMessage('Received status code ' + response.statusCode);
            }
          );
        } else {
          msg.author.sendMessage('`' + getConfig().trigger + 'strawpoll` command usage: `<option1>, <option2>, [option3], ...`');
        }
      }
    },
    '8ball': {
      description: "It's an 8ball...",
      fn: function(msg, suffix) {
        const responses = [
          "Can the Pope's dick fit through a doughnut?",
          'Can you get AIDS from fucking a monkey?',
          'Does erasing system32 speed up your PC?', 
          'Is Clinton really innocent?',
          'Does the Pope shit in the woods?',
          'Will Donald Trump become the president of the United States?',
          'Will there be a Half-Life 3?',
          'Fuck if I know...',

          'Aw, hell no!', 'Probably.', 'It is certain.', 'Without a doubt!', 'You may rely on it.', 'Most likely!', 'Yes!', 'Signs point to yes.', 'Better not tell you now!', "Don't count on it!", 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful!'];
        const asuffix = suffix ? '`' + suffix + '`: ' : '';
        msg.reply(asuffix + (responses[Math.floor(Math.random() * (responses.length))]));
      }
    },
    'jpeg': {
      fn: function(message, suffix) {
        if (!suffix) {
          message.channel.sendMessage('Enter an URL to JPEG!');
          return;
        }

        request.post(
          'http://api.jpeg.li/v1/existing',
          { form: { url: suffix } },
          function(error, response, body) {
            if (error) {
              console.error(error);
            }
            if (response.statusCode == 200) {
              bot.sendMessages(message.channel, JSON.parse(body).url);
            } else {
              console.log(chalk.red('Failed with code: ' + response.statusCode + ' after trying URL ' + suffix));
            }
          }
        );
      }
    },
    'johncena': {
      description: 'AND HIS NAME IS...',
      fn: function(msg) {
        msg.channel.sendMessage(' **AND HIS NAME IS** https://www.youtube.com/watch?v=4k1xY7v8dDQ');
      }
    },
    'spam': {
      description: 'keep it in the #spam fam',
      fn: function(message) {
        message.channel.sendMessage(':warning: keep it in the #spam fam :warning:');
      }
    },
    'imgur': {
      description: 'mirror an image to imgur',
      fn: function(message) {
        // TODO
        // https://www.npmjs.com/package/imgur-node-api
        // https://github.com/jamiees2/imgur-node-api
      }
    },
    'pornme': {
      description: 'Gets the RedTube video that represents your life.',
      synonyms: [ 'porn-me' ],
      fn: function(message, suffix) {
        if (!suffix) {
          message.channel.sendMessage('Enter your birth date!');
          return;
        }
        const date = parseDate(suffix);
        message.channel.sendMessage('http://www.redtube.com/' + date.getDate() + (date.getMonth() + 1) + (date.getFullYear().toString().substr(2, 2)));
      }
    },
    'shut': {
      description: 'YOU NEED TO SHUT THE FUCK UP',
      fn: function(message) {
        message.channel.sendMessage('https://i.ytimg.com/vi/wQYob6dpTTk/hqdefault.jpg');
        
        setTimeout(function() {
          message.channel.sendMessage('YOU');
          setTimeout(function() {
            message.channel.sendMessage('NEED');
            setTimeout(function() {
              message.channel.sendMessage('TO');
              setTimeout(function() {
                message.channel.sendMessage('SHUT');
                setTimeout(function() {
                  message.channel.sendMessage('THE');
                  setTimeout(function() {
                    message.channel.sendMessage('FUCK');
                    setTimeout(function() {
                      message.channel.sendMessage('UP');
                    }, 500);
                  }, 500);
                }, 500);
              }, 500);
            }, 500);
          }, 500);
        }, 500);
      }
    },
    'superb': {
      fn: function(message) {
        message.channel.sendMessage(superb[rand(superb.length)]);
      },
      synonyms: [ 'adjective' ],
      description: 'Get superb-like words!'
    },
    'catnames': {
      fn: function(message) {
        message.channel.sendMessage(catnames[rand(catnames.length)]);
      },
      synonyms: [ 'catname', 'cat-name', 'cat-names' ],
      description: 'Get popular cat names.'
    },
    'maledognames': {
      fn: function(message) {
        message.channel.sendMessage(maledognames[rand(maledognames.length)]);
      },
      synonyms: [ 'male-dog-names', 'male-dog-name', 'maledogname' ],
      description: 'Get popular dog names. (Male)'
    },
    'femaledognames': {
      fn: function(message) {
        message.channel.sendMessage(femaledognames[rand(femaledognames.length)]);
      },
      synonyms: [ 'female-dog-names', 'female-dog-name', 'femaledogname' ],
      description: 'Get popular dog names. (Female)'
    },
    'superheroes': {
      fn: function(message) {
        message.channel.sendMessage(superheroes[rand(superheroes.length)]);
      },
      synonyms: [ 'superhero' ],
      description: 'Get superhero names.'
    },
    'supervillains': {
      fn: function(message) {
        message.channel.sendMessage(supervillains[rand(supervillains.length)]);
      },
      synonyms: [ 'supervillain' ],
      description: 'Get supervillain names.'
    },
    'asciifaces': { // from https://github.com/maxogden/cool-ascii-faces under BSD
      fn: function(message) {
        message.channel.sendMessage(asciifaces[rand(asciifaces.length)]);
      },
      synonyms: [ 'asciiface', 'ascii-faces', 'ascii-face' ],
      description: 'Get some cool ascii faces.'
    },
    'catfaces': { // from https://github.com/melaniecebula/cat-ascii-faces under BSD
      fn: function(message) {
        message.channel.sendMessage(catfaces[rand(catfaces.length)]);
      },
      synonyms: [ 'catface', 'cat-faces', 'cat-face' ],
      description: '₍˄·͈༝·͈˄₎◞ ̑̑ෆ⃛ (=ↀωↀ=)✧ (^･o･^)ﾉ”.'
    },
    'joke': { // from https://github.com/melaniecebula/cat-ascii-faces under BSD
      fn: function(message) {
        message.channel.sendMessage(jokes[rand(jokes.length)]);
      },
      synonyms: [ 'jokes' ],
      description: 'Dark jokes!'
    },
    'cows': { // from https://github.com/maxogden/cool-ascii-faces under BSD
      fn: function(message) {
        message.channel.sendMessage('````\n' + cows[rand(cows.length)] + '````');
      },
      synonyms: [ 'ascii-cow', 'ascii-cows' ],
      description: 'ASCII cows.'
    },
    'cuddle': {
      description: 'cuddle with someone :3',
      fn: function(message) {
        message.channel.sendMessage(message.mentions.length > 0 ? 
          (message.author.toString() + ' cuddles with ' + message.mentions[0]) : 
          ('Bonzi cuddles with ' + message.author.toString())
        );
      }
    },
    'highfive': {
      description: 'highfive someone!',
      fn: function(message) {
        message.channel.sendMessage(message.mentions.length > 0 ? 
          (message.author.toString() + ' highfives ' + message.mentions[0]) : 
          ('Bonzi highfives ' + message.author.toString())
        );
      }
    },
    'hug': {
      description: 'hug someone :3',
      fn: function(message) {
        message.channel.sendMessage(message.mentions.length > 0 ? 
          (message.author.toString() + ' hugs ' + message.mentions[0]) : 
          ('Bonzi hugs ' + message.author.toString())
        );
      }
    },
    'poke': {
      description: 'poke someone :3',
      fn: function(message) {
        message.channel.sendMessage(message.mentions.length > 0 ? 
          (message.author.toString() + ' pokes ' + message.mentions[0]) : 
          ('Bonzi pokes ' + message.author.toString())
        );
      }
    },
    'kiss': {
      description: 'kiss someone :3',
      fn: function(message) {
        message.channel.sendMessage(message.mentions.length > 0 ? 
          (message.author.toString() + ' kisses ' + message.mentions[0]) : 
          ('Bonzi kisses ' + message.author.toString())
        );
      }
    },
    'pat': {
      description: 'pat someone :3',
      fn: function(message) {
        message.channel.sendMessage(message.mentions.length > 0 ? 
          (message.author.toString() + ' pats ' + message.mentions[0]) : 
          ('Bonzi pats ' + message.author.toString())
        );
      }
    },
    'slap': {
      description: 'slap someone!',
      fn: function(message) {
        message.channel.sendMessage(message.mentions.length > 0 ? 
          (message.author.toString() + ' slaps ' + message.mentions[0]) : 
          ('Bonzi slaps ' + message.author.toString())
        );
      }
    },
    'swear': {
      description: 'Convert your message into... Swearing?',
      synonyms: [ 'coprolalia' ],
      fn: function(message, suffix) {
        if (!suffix) {
          message.channel.sendMessage('Enter a message to convert!');
          return;
        }

        message.channel.sendMessage(coprolalia.replaceString(suffix));
      }
    },
    'unshort': {
      description: 'Unshorten an URL.',
      synonyms: [ 'unshorten', 'deadfly' ],
      fn: function(message, suffix) {
        if (!suffix) {
          message.channel.sendMessage('Enter a link to unshorten!');
          return;
        }

        uu.expand(suffix, function(err, url) {
          // connection error or similar
          if (err) message.channel.sendMessage('Could not unshorten url: ' + err);
          else if (url) message.channel.sendMessage('Original url is: ' + url);
          // no shortening service or an unknown one is used
          else message.channel.sendMessage('Could not expand dong. Unknown error.');
        });

      }
    },
    'bullshitgen': {
      description: 'Generate bullshit.',
      fn: function(message, suffix) {
        // init sentence pool, could be automated
        bs.initializeSentencePool();
        // create topic, could also be automated
        const topic = BS.kit.randomInt(bs.sentencePatterns.length - 1);
        // generate 5 random sentences on the same topic and post to console
        message.channel.sendMessage(bs.generateText(suffix ? parseInt(suffix) : 5, topic));
      }
    },
//    'trivia': { TODO
//      description: 'Get a trivia question!',
//      fn: function(message, suffix) {
//        
//      }
//    },
    // trivia cleaner: Object.keys(a).forEach(function(k) { a[k] = a[k].toLowerCase().replace(/[\.\(\)]/gi, '').replace(/\'s\b/gi, 's'); });
  },
};