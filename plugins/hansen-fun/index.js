'use strict';

// Discord Bot API
const bot = require('../../bot.js');
const utility = require('../../utility.js');

const request = require('request');
const chalk = require('chalk');
const uu = require('url-unshort')(); //?

const rand = require('../../lib/rand.js');
const coprolalia = require('../../lib/coprolalia.js');
const BS = require('../../lib/bullshit.js');
const bs = new BS();
const unirestHelper = require('../../lib/unirest-helper.js');
const htmlCleaner = require('../../lib/html-cleaner.js');

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
const shitposts = require('./shitposts.json');
const giiva = require('./giiva.json');

const trivia = require('./trivia.json');

function cleanString(str) {
  return str.trim().toLowerCase().replace(/[\.\(\)]/gi, '').replace(/\'s\b/gi, 's').replace(/,/g, '').replace(/ +and +/g, ' ');
}

function parseDate(str) {
  if (str.indexOf('-') > -1) {
    const parts = str.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
  }
  return new Date(str);
}

module.exports = {
  name: 'hansen-fun',
  defaultCommandPrefix: 'hansen-fun',
  commands: {
    'excuse': {
      fn: function (message) {
        message.channel.sendMessage(excuses[rand(excuses.length)]);
      },
      description: 'Get an IT excuse'
    },
    'avatar': { // from brussell98/BrussellBot under MIT
      description: "Get a link to a user's avatar.",
      fn: function (msg, suffix) {
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
        if (msg.mentions.size === 0 && !suffix) {
          if (msg.author.avatarURL !== null) {
            msg.channel.sendMessage(msg.author.username + "'s avatar: " + msg.author.avatarURL);
          } else {
            msg.channel.sendMessage(msg.author.username + ' has no avatar', function (erro, wMsg) {
              bot.deleteMessage(wMsg, { 'wait': 8000 });
            });
          }
        } else if (msg.mentions.size > 0) {
          if (msg.everyoneMentioned) {
            msg.channel.sendMessage('Nice try.', function (erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            return;
          }
          if (msg.mentions.size > 6) {
            msg.channel.sendMessage('No more than 6 users.', function (erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            return;
          }
          msg.mentionsArr.map(function (usr) {
            if (usr.avatarURL !== null) {
              msg.channel.sendMessage('**' + usr.username.replace(/@/g, '@\u200b') + "**'s avatar: " + usr.avatarURL + '');
            } else {
              msg.channel.sendMessage('**' + usr.username + '** has no avatar', function (erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            }
          });
        } else {
          if (msg.everyoneMentioned) {
            msg.channel.sendMessage('Nice try.', function (erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            return;
          }
          const users = suffix.split(/, ?/);
          if (users.size > 6) {
            msg.channel.sendMessage('No more than 6 users.', function (erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
            return;
          }
          users.map(function (user) {
            const usr = msg.channel.guild.members.get('username', user);
            if (usr) {
              if (usr.avatarURL !== null) {
                msg.channel.sendMessage('**' + usr.username.replace(/@/g, '@\u200b') + "**'s avatar: " + usr.avatarURL + '');
              } else {
                msg.channel.sendMessage('**' + usr.username + '** has no avatar', function (erro, wMsg) { bot.deleteMessage(wMsg, { 'wait': 8000 }); });
              }
            } else {
              msg.channel.sendMessage('User "' + user + '" not found. If you want to get the avatar of multiple users separate them with a comma.', function (erro, wMsg) {
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
      fn: function (msg, suffix) {
        if (suffix && /^[^, ](.*), ?(.*)[^, ]$/.test(suffix)) {
          suffix = msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).split(/, ?/);
          request.post({
            url: 'https://strawpoll.me/api/v2/polls',
            headers: { 'content-type': 'application/json' },
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
          });
        } else {
          msg.author.sendMessage('`' + utility.config.trigger + 'strawpoll` command usage: `<option1>, <option2>, [option3], ...`');
        }
      }
    },
    '8ball': {
      description: "It's an 8ball...",
      fn: function (msg, suffix) {
        const responses = [
          "Can the Pope's dick fit through a doughnut?",
          'Can you get AIDS from fucking a monkey?',
          'Does erasing system32 speed up your PC?',
          'Is Clinton really innocent?',
          'Does the Pope shit in the woods?',
          'Will Donald Trump become the president of the United States?',
          'Will there be a Half-Life 3?',
          'Fuck if I know...',

          'Aw, hell no!', 'Probably.', 'It is certain.', 'Without a doubt!', 'You may rely on it.', 'Most likely!', 'Yes!', 'Signs point to yes.', 'Better not tell you now!', "Don't count on it!", 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful!'
        ];
        const asuffix = suffix ? '`' + suffix + '`: ' : '';
        msg.reply(asuffix + (responses[Math.floor(Math.random() * (responses.length))]));
      }
    },
    'jpeg': {
      fn: function (message, suffix) {
        if (!suffix) {
          message.channel.sendMessage('Enter an URL to JPEG!');
          return;
        }

        request.post(
          'http://api.jpeg.li/v1/existing', { form: { url: suffix } },
          function (error, response, body) {
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
      fn: function (msg) {
        msg.channel.sendMessage(' **AND HIS NAME IS** https://www.youtube.com/watch?v=4k1xY7v8dDQ');
      }
    },
    'spam': {
      description: 'keep it in the #spam fam',
      fn: function (message) {
        message.channel.sendMessage(':warning: keep it in the #spam fam :warning:');
      }
    },
    'imgur': {
      description: 'mirror an image to imgur',
      fn: function (message) {
        // TODO
        // https://www.npmjs.com/package/imgur-node-api
        // https://github.com/jamiees2/imgur-node-api
      }
    },
    'pornme': {
      description: 'Gets the RedTube video that represents your life.',
      synonyms: ['porn-me'],
      fn: function (message, suffix) {
        if (!suffix) {
          message.channel.sendMessage('Enter your birth date!');
          return;
        }
        try {
          const date = parseDate(suffix);
          message.channel.sendMessage('http://www.redtube.com/' + date.getDate() + (date.getMonth() + 1) + (date.getFullYear().toString().substr(2, 2)));
        } catch (err) {
          message.channel.sendMessage('Invalid format (`' + err + '`)');
        }
      }
    },
    'shut': {
      description: 'YOU NEED TO SHUT THE FUCK UP',
      fn: function (message) {
        message.channel.sendMessage('https://i.ytimg.com/vi/wQYob6dpTTk/hqdefault.jpg');

        setTimeout(function () {
          message.channel.sendMessage('YOU').then(() => {
            setTimeout(function () {
              message.channel.sendMessage('NEED').then(() => {
                setTimeout(function () {
                  message.channel.sendMessage('TO').then(() => {
                    setTimeout(function () {
                      message.channel.sendMessage('SHUT').then(() => {
                        setTimeout(function () {
                          message.channel.sendMessage('THE').then(() => {
                            setTimeout(function () {
                              message.channel.sendMessage('FUCK').then(() => {
                                setTimeout(function () {
                                  message.channel.sendMessage('UP').then(() => {});
                                }, 250);
                              });
                            }, 250);
                          });
                        }, 250);
                      });
                    }, 250);
                  });
                }, 250);
              });
            }, 250);
          });
        }, 250);
      }
    },
    'superb': {
      fn: function (message) {
        message.channel.sendMessage(superb[rand(superb.length)]);
      },
      synonyms: ['adjective'],
      description: 'Get superb-like words!'
    },
    'catnames': {
      fn: function (message) {
        message.channel.sendMessage(catnames[rand(catnames.length)]);
      },
      synonyms: ['catname', 'cat-name', 'cat-names'],
      description: 'Get popular cat names.'
    },
    'maledognames': {
      fn: function (message) {
        message.channel.sendMessage(maledognames[rand(maledognames.length)]);
      },
      synonyms: ['male-dog-names', 'male-dog-name', 'maledogname'],
      description: 'Get popular dog names. (Male)'
    },
    'femaledognames': {
      fn: function (message) {
        message.channel.sendMessage(femaledognames[rand(femaledognames.length)]);
      },
      synonyms: ['female-dog-names', 'female-dog-name', 'femaledogname'],
      description: 'Get popular dog names. (Female)'
    },
    'superheroes': {
      fn: function (message) {
        message.channel.sendMessage(superheroes[rand(superheroes.length)]);
      },
      synonyms: ['superhero'],
      description: 'Get superhero names.'
    },
    'supervillains': {
      fn: function (message) {
        message.channel.sendMessage(supervillains[rand(supervillains.length)]);
      },
      synonyms: ['supervillain'],
      description: 'Get supervillain names.'
    },
    'asciifaces': { // from https://github.com/maxogden/cool-ascii-faces under BSD
      fn: function (message) {
        message.channel.sendMessage(asciifaces[rand(asciifaces.length)]);
      },
      synonyms: ['asciiface', 'ascii-faces', 'ascii-face'],
      description: 'Get some cool ascii faces.'
    },
    'catfaces': { // from https://github.com/melaniecebula/cat-ascii-faces under BSD
      fn: function (message) {
        message.channel.sendMessage(catfaces[rand(catfaces.length)]);
      },
      synonyms: ['catface', 'cat-faces', 'cat-face'],
      description: '₍˄·͈༝·͈˄₎◞ ̑̑ෆ⃛ (=ↀωↀ=)✧ (^･o･^)ﾉ”.'
    },
    'joke': { // from https://github.com/melaniecebula/cat-ascii-faces under BSD
      fn: function (message) {
        message.channel.sendMessage(jokes[rand(jokes.length)]);
      },
      synonyms: ['jokes'],
      description: 'Dark jokes!'
    },
    'cows': { // from https://github.com/maxogden/cool-ascii-faces under BSD
      fn: function (message) {
        message.channel.sendMessage('````\n' + cows[rand(cows.length)] + '````');
      },
      synonyms: ['ascii-cow', 'ascii-cows'],
      description: 'ASCII cows.'
    },
    'shitposts': { // from https://github.com/maxogden/cool-ascii-faces under BSD
      fn: function (message) {
        message.channel.sendMessage(shitposts[rand(shitposts.length)]);
      },
      description: 'Post shits.'
    },
    'cuddle': {
      description: 'cuddle with someone :3',
      fn: function (message) {
        message.channel.sendMessage(message.mentions.users.size > 0 ?
          (message.author.toString() + ' cuddles with ' + message.mentionsArr[0]) :
          ('Bonzi cuddles with ' + message.author.toString())
        );
      }
    },
    'highfive': {
      description: 'highfive someone!',
      fn: function (message) {
        message.channel.sendMessage(message.mentions.users.size > 0 ?
          (message.author.toString() + ' highfives ' + message.mentionsArr[0]) :
          ('Bonzi highfives ' + message.author.toString())
        );
      }
    },
    'hug': {
      description: 'hug someone :3',
      fn: function (message) {
        message.channel.sendMessage(message.mentions.users.size > 0 ?
          (message.author.toString() + ' hugs ' + message.mentionsArr[0]) :
          ('Bonzi hugs ' + message.author.toString())
        );
      }
    },
    'poke': {
      description: 'poke someone :3',
      fn: function (message) {
        message.channel.sendMessage(message.mentions.users.size > 0 ?
          (message.author.toString() + ' pokes ' + message.mentionsArr[0]) :
          ('Bonzi pokes ' + message.author.toString())
        );
      }
    },
    'kiss': {
      description: 'kiss someone :3',
      fn: function (message) {
        message.channel.sendMessage(message.mentions.users.size > 0 ?
          (message.author.toString() + ' kisses ' + message.mentionsArr[0]) :
          ('Bonzi kisses ' + message.author.toString())
        );
      }
    },
    'pat': {
      description: 'pat someone :3',
      fn: function (message) {
        message.channel.sendMessage(message.mentions.users.size > 0 ?
          (message.author.toString() + ' pats ' + message.mentionsArr[0]) :
          ('Bonzi pats ' + message.author.toString())
        );
      }
    },
    'slap': {
      description: 'slap someone!',
      fn: function (message) {
        message.channel.sendMessage(message.mentions.users.size > 0 ?
          (message.author.toString() + ' slaps ' + message.mentionsArr[0]) :
          ('Bonzi slaps ' + message.author.toString())
        );
      }
    },
    'swear': {
      description: 'Convert your message into... Swearing?',
      synonyms: ['coprolalia'],
      fn: function (message, suffix) {
        if (!suffix) {
          message.channel.sendMessage('Enter a message to convert!');
          return;
        }

        message.channel.sendMessage(coprolalia.replaceString(suffix));
      }
    },
    'unshort': {
      description: 'Unshorten an URL.',
      synonyms: ['unshorten', 'deadfly'],
      fn: function (message, suffix) {
        if (!suffix) {
          message.channel.sendMessage('Enter a link to unshorten!');
          return;
        }

        uu.expand(suffix, function (err, url) {
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
      fn: function (message, suffix) {
        // init sentence pool, could be automated
        bs.initializeSentencePool();
        // create topic, could also be automated
        const topic = BS.kit.randomInt(bs.sentencePatterns.length - 1);
        // generate 5 random sentences on the same topic and post to console
        message.channel.sendMessage(bs.generateText(suffix ? parseInt(suffix) : 5, topic));
      }
    },
    'trivia': {
      description: 'Get a trivia question!',
      fn: function (message, suffix) {
        const tKeys = Object.keys(trivia);
        const question = utility.getPseudoChannels().triviaQuestion = Math.floor(Math.random() * tKeys.length);
        message.channel.sendMessage(tKeys[question] + '\n(Type +answer <answer> to answer the question)');
      }
    },
    'answer': {
      description: 'Answer a trivia question!',
      fn: function (message, suffix) {
        const correctAnswerN = utility.getPseudoChannels().triviaQuestion;
        const tKeys = Object.keys(trivia);
        const correctAnswer = trivia[tKeys[correctAnswerN]];
        const correct = cleanString(suffix) === cleanString(correctAnswer);

        const question = utility.getPseudoChannels().triviaQuestion = Math.floor(Math.random() * tKeys.length);
        message.channel.sendMessage((correct ? 'Correctamundo!' : ('Booo. Wrong! The answer was ' + correctAnswer)) + '\nFor the next question: ' + tKeys[question] + '\n(Type +answer <answer> to answer the question)');
      }
    },
    // trivia cleaner: Object.keys(a).forEach(function(k) { a[k] = a[k].toLowerCase().replace(/[\.\(\)]/gi, '').replace(/\'s\b/gi, 's'); });
    'steam': {
      description: 'Get info on a Steam game.',
      fn: function (message, suffix) {

        try {
          const appid = suffix;
          const json_url = 'http://store.steampowered.com/api/appdetails?appids=' + suffix;

          unirestHelper.getPage(json_url, function(result) {

            //console.log('body: ' + JSON.stringify(result.body));
            if (!result.body[suffix] || !result.body[suffix].success) {
              message.channel.sendMessage('Steaminfo: Failed to load data for ' + appid + ' (raw json contents: ```json\n' + JSON.stringify(result) + '```)');
              return;
            }

            result = result.body[suffix].data;

            let steamcontent = result.header_image + '\n';

            if (result.movies) {
              if (result.movies[0] && result.movies[0].webm && result.movies[0].webm.max)
                steamcontent += '[video] ' + result.movies[0].webm.max + '\n';
              else if (result.movies.webm && result.movies.webm.max)
                steamcontent += '[video] ' + result.movies.webm.max + '\n';
            }

            steamcontent += '\n**' + result.name + '**\n';

            steamcontent += '\n**Store Page:** http://store.steampowered.com/app/' + appid + '/\n**Genre(s):** ';

            if (result.genres.length === undefined) {
              steamcontent += result.genres.description;
            } else {
              steamcontent += result.genres[0].description;
              for (let i = 1; i < result.genres.length; i++)
                steamcontent += ', ' + result.genres[i].description;
            }

            steamcontent += '\n**Developer: **' + result.developers + '\n';
            steamcontent +=   '**Publisher: **' + result.publishers + '\n';
            steamcontent +=   '**Release Date: **' + result.release_date.date + '\n';
            steamcontent +=   '**Language(s): **' + (result.supported_languages.replace(/<strong><\/strong>/g, '').replace(/<br>/g, '')) + '\n';

            steamcontent += '\n';
            if (result.categories) {
              for (let i = 0; i < result.categories.length; i++) {
                if (steamcontent.length > 1000) {
                  steamcontent += '(' + (result.categories.length - i) + ' more)\n';
                  break;
                }
                const cat_desc = result.categories[i].description;
                steamcontent += '* ' + cat_desc + '\n';
              }
            }
            if (result.platforms.windows) {
              steamcontent += '* Windows support\n';
            }
            if (result.platforms.mac) {
              steamcontent += '* Mac support\n';
            }
            if (result.platforms.linux) {
              steamcontent += '* SteamOS/Linux support\n';
            }

            if (steamcontent.length > 1000) {
              console.log('1 len is ' + steamcontent.length);
              message.channel.sendMessage(steamcontent);
              steamcontent = '';
            }

            const aboutTheGame = htmlCleaner.stripTags(result.short_description || result.about_the_game);
            if (aboutTheGame.length + steamcontent.length <= 1000) {
              steamcontent += '\n**About The Game:**\n' + aboutTheGame;
            } else {
              steamcontent += '\n**About The Game:**\n' + (aboutTheGame.substr(0, 500) + '...');
            }
            steamcontent += '\n\n**System Requirements:**\n';
            if (result.pc_requirements.minimum) {
              steamcontent += htmlCleaner.stripTags(result.pc_requirements.minimum);
            }
            if (result.pc_requirements.recommended) {
              steamcontent += htmlCleaner.stripTags(result.pc_requirements.recommended).replace(/            /, '');
            }

            console.log('len is ' + steamcontent.length);
            message.channel.sendMessage(steamcontent);
          });
        } catch(err) {
          message.channel.sendMessage(typeof err === 'string' ? err : JSON.stringify(err));
        }

      }
    },
    'stocks': {
      description: 'Get Stock Market info on a company.',
      fn: function (message, suffix) {

        unirestHelper.getPage('http://finance.yahoo.com/d/quotes.csv?s=' + (suffix || 'msft') + '&f=ydb2r1b3qpoc1d1cd2c6t1k2p2c8m5c3m6gm7hm8k1m3lm4l1t8w1g1w4g3p1g4mg5m2g6kvjj1j5j3k4f6j6nk5n4ws1xj2va5b6k3t7a2t615l2el3e7v1e8v7e9s6b4j4p5p6rr2r5r6r7s7',
          function(result) {
            const values = result.body.split(',');

            const messagea = 
            '**Showing Stock Market info for ' + (suffix ? suffix.toUpperCase() : 'MSFT') + '**\n' +
            'Name: ' + values[49] + '\n' + // n
            'Volume: ' + values[41] + '\n' + // v

            '**Dividend data:**\n' +
            'Dividend Yield: ' + values[0] + '\n' + // y
            'Dividend/Share: ' + values[1] + '\n' + // d
            'Dividend Pay Date: ' + values[3] + '\n' + // r1
            'Ex-Dividend Date: ' + values[5] + '\n' + // q

            '**Real-time data:**\n' +
            'Ask (Real-time): ' + values[2] + '\n' + // b2
            'Bid (Real-time): ' + values[4] + '\n' + // b3
            'Change (Real-time): ' + values[12] + '\n' + // c6
            'Change Percent (Real-time): ' + values[14] + '\n' + // k2
            'After Hours Change (Real-time): ' + values[16] + '\n' + // c8
            'Day’s Value Change (Real-time): ' + values[32] + '\n' + // w4
            'Day’s Range (Real-time): ' + values[38] + '\n' + // m2
            'Holdings Gain Percent (Real-time): ' + values[37] + '\n' + // g5
            'Holdings Gain (Real-time): ' + values[39] + '\n' + // g6
            'Market Cap (Real-time): ' + values[45] + '\n' + // j3
            'Holdings Value (Real-time): ' + values[68] + '\n' + // v7
            'P/E Ratio (Real-time): ' + values[76] + '\n' + // r2

            '**Price data:**\n' +
            'Previous Close: ' + values[6] + '\n' + // p
            'Open: ' + values[7] + '\n' + // o
            'Change: ' + values[8] + '\n' + // c1
            'Change & Percent Change: ' + values[10] + '\n' + // c
            'Change in Percent: ' + values[15] + '\n' + // p2
            'Revenue: ' + values[70] + '\n' + // s6
            'Book Value: ' + values[71] + '\n' + // b4
            'Commission: ' + values[18] + '\n' + // c3
            'Price/Sales: ' + values[73] + '\n' + // p5
            'Price/Book: ' + values[74] + '\n'; // p6

            const messageb = 
            '**Trade data:**\n' +
            'Last Trade Date: ' + values[9] + '\n' + // d1
            'Last Trade Time: ' + values[13] + '\n' + // t1
            'Trade Date: ' + values[11] + '\n' + // d2

            'Last Trade (Real-time) With Time: ' + values[24] + '\n' + // k1
            'Last Trade (With Time): ' + values[26] + '\n' + // l
            'Last Trade (Price Only): ' + values[28] + '\n' + // l1

            '**Moving Average change data:**\n' +
            'Change From 200-day Moving Average: ' + values[17] + '\n' + // m5
            'Change From 50-day Moving Average: ' + values[21] + '\n' + // m7
            '50-day Moving Average: ' + values[25] + '\n' + // m3
            'Percent Change From 200-day Moving Average: ' + values[19] + '\n' + // m6
            'Percent Change From 50-day Moving Average: ' + values[23] + '\n' + // m8
            '200-day Moving Average: ' + values[27] + '\n' + // m4

            '**Lows and Highs:**\n' +
            'Day’s Low: ' + values[20] + '\n' + // g
            'Day’s High: ' + values[22] + '\n' + // h
            'Day’s Value Change: ' + values[30] + '\n' + // w1
            '52-week High: ' + values[40] + '\n' + // k
            '52-week Low: ' + values[42] + '\n' + // j
            '52-week Range: ' + values[52] + '\n' + // w

            '**Lows and Highs changes:**\n' +
            'Change From 52-week Low: ' + values[44] + '\n' + // j5
            'Change From 52-week High: ' + values[46] + '\n' + // k4
            'Percent Change From 52-week Low: ' + values[48] + '\n' + // j6
            'Percent Change From 52-week High: ' + values[50] + '\n'; // k5

            const messagec = 
            '**Unsorted data:**\n' + 
            'Market Capitalization: ' + values[43] + '\n' + // j1
            'Day’s Range: ' + values[36] + '\n' + // m
            'Float Shares: ' + values[47] + '\n' + // f6

            '1 yr Target Price: ' + values[29] + '\n' + // t8
            'Holdings Gain Percent: ' + values[31] + '\n' + // g1
            'Annualized Gain: ' + values[33] + '\n' + // g3
            'Price Paid: ' + values[34] + '\n' + // p1
            'Holdings Gain: ' + values[35] + '\n' + // g4
            'Notes: ' + values[51] + '\n' + // n4
            'Shares Owned: ' + values[53] + '\n' + // s1
            'Stock Exchange: ' + values[54] + '\n' + // x
            //'undefined: ' + values[55] + '\n' + // j2
            'Ask Size: ' + values[56] + '\n' + // a5
            'Bid Size: ' + values[57] + '\n' + // b6
            'Last Trade Size: ' + values[58] + '\n' + // k3
            'Ticker Trend: ' + values[59] + '\n' + // t7
            'Average Daily Volume: ' + values[60] + '\n' + // a2
            'Trade Links: ' + values[61] + '\n' + // t6
            //'undefined: ' + values[62] + '\n' + // 15l2
            'Earnings/Share: ' + values[63] + '\n' + // e
            'Low Limit: ' + values[64] + '\n' + // l3
            'EPS Estimate Current Year: ' + values[65] + '\n' + // e7
            'Holdings Value: ' + values[66] + '\n' + // v1
            'EPS Estimate Next Year: ' + values[67] + '\n' + // e8
            'EPS Estimate Next Quarter: ' + values[69] + '\n' + // e9
            'EBITDA: ' + values[72] + '\n' + // j4
            'P/E Ratio: ' + values[75] + '\n' + // r
            'PEG Ratio: ' + values[77] + '\n' + // r5
            'Price/EPS Estimate Current Year: ' + values[78] + '\n' + // r6
            'Price/EPS Estimate Next Year: ' + values[79] + '\n' + // r7
            'Short Ratio: ' + values[80] + '\n'; // s7

            message.channel.sendMessage(messagea).then(() => {
              message.channel.sendMessage(messageb).then(() => {
                message.channel.sendMessage(messagec);
              });
            });
          }
        );
      }
    },
    'wikipedia': {
      description: 'Get the excerpt of a Wikipedia page.',
      fn: function (message, suffix) {

        unirestHelper.getPage('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + encodeURI(suffix),
          function(result) {
            if (result.body.query && result.body.query.pages) {
              const k = result.body.query.pages[Object.keys(result.body.query.pages)[0]];
              if (k) {
                if (k.extract) {
                  message.channel.sendMessage('**' + k.title + '**\n' + (k.extract.length > 1400 ? k.extract.substr(0, 1400) + '...' : k.extract));
                } else {
                  message.channel.sendMessage('_(No short description for this article available)_');
                }
              } else {
                message.channel.sendMessage('_Article not found._');
              }
            } else {
              message.channel.sendMessage('_Article not found._');
            }
          }
        );
      }
    },
    'duckduckgo': {
      description: 'Search for something on DuckDuckGo.',
      fn: function (message, suffix) {

        unirestHelper.getMashape('https://duckduckgo-duckduckgo-zero-click-info.p.mashape.com/?format=json&no_html=1&no_redirect=1&q=' + suffix.replace(/ /g, '+') + '&skip_disambig=1',
          utility.config.fun2.apiKeys.mashape,
          'application/json',
          function(result) {
            if (!result.body.Results || !result.body.Results[0] || !result.body.Results[0].FirstURL) {
              message.channel.sendMessage('_No results found._');
              return;
            }

            message.channel.sendMessage('**You searched for `' + suffix + '`**:\n' + result.body.Results[0].FirstURL + '\n' + result.body.Results[0].Text);
          }
        );
      }
    },
    'john-madden': {
      description: 'Get a picture of John Madden. Yep. That\'s all this does.',
      fn: function (message, suffix) {
        message.channel.sendFile('https://fallk.github.io/nfmm-addons/john-madden/madden' + (rand(372) + 1) + '.jpeg');
      }
    },
    'bob-ross': {
      description: 'Get a picture of Bob Ross. Yep. That\'s all this does.',
      fn: function (message, suffix) {
        message.channel.sendFile('https://fallk.github.io/nfmm-addons/bob-ross/b' + (rand(323) + 1) + '.jpeg');
      }
    },
    'giivasunner': {
      description: 'Get a random GiivaSunner/SiivaGunner video.',
      fn: function (message, suffix) {
        message.channel.sendMessage('https://www.youtube.com/watch?v=' + rand.choose(giiva));
      },
      synonyms: ['siivagunner', 'gilvasunner', 'silvagunner'],
    },
//    'snap': {
//      description: 'Grab a screenshot of a page. Bot operators only.',
//      fn: function (message, suffix) {
//        message.channel.sendMessage('This would be a lovely command... IF I GOT PHANTOMJS TO WORK....');
//      }
//    },
  },
};
