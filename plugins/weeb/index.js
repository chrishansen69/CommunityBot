'use strict';

// from brussell98/BrussellBot under the MIT License
const request = require('request');
const xml2js = require('../../lib/xml2js');
const osuapi = require('osu-api');
const ent = require('../../lib/entities.js');
const waifus = require('./waifus.json');

const bot = require('../../bot.js');
const getConfig = require('../../utility.js').getConfig;

const Ratings = {};

// .includes() polyfill
if (!Array.prototype.includes)
Array.prototype.includes=function(a){return this.indexOf(a) !== -1;};

if (!getConfig().weeb) {
  getConfig().weeb = {};
  getConfig().weeb.mal_pass = '';
  getConfig().weeb.mal_user = '';
  getConfig().weeb.osu_api_key = '';
  getConfig().weeb.imgur_client_id = '';
  getConfig().weeb.allowNSFW = true;
}

/**
 * @param  {User} sender
 * @param  {String} command
 * @param  {String} usage
 */
function correctUsage(sender, command, usage) {
  sender.sendMessage('`' + getConfig().trigger + command + '` command usage: `' + usage + '`');
}

function findUser(members, query) {
  let usr = members.find(member=>{ return (member === undefined || member.username === undefined) ? false : member.username.toLowerCase() == query.toLowerCase(); });
  if (!usr) { usr = members.find(member=>{ return (member === undefined || member.username === undefined) ? false : member.username.toLowerCase().indexOf(query.toLowerCase()) === 0; }); }
  if (!usr) { usr = members.find(member=>{ return (member === undefined || member.username === undefined) ? false : member.username.toLowerCase().includes(query.toLowerCase()); }); }
  return usr || false;
}

function generateRandomRating(fullName, storeRating) {
  const weightedNumber = Math.floor((Math.random() * 20) + 1); //between 1 and 20
  let score;
  const moreRandom = Math.floor(Math.random() * 4);
  if (weightedNumber < 5) score = Math.floor((Math.random() * 3) + 1); //between 1 and 3
  else if (weightedNumber > 4 && weightedNumber < 16) score = Math.floor((Math.random() * 4) + 4); //between 4 and 7
  else if (weightedNumber > 15) score = Math.floor((Math.random() * 3) + 8); //between 8 and 10
  if (moreRandom === 0 && score !== 1) score -= 1;
  else if (moreRandom === 3 && score !== 10) score += 1;
  if (storeRating) Ratings[fullName.toLowerCase()] = score;
  return score;
}

function generateUserRating(msg, fullName) {
  const user = msg.channel.guild.members.get('username', fullName);
  if (user === undefined) return generateRandomRating();
  let score = generateRandomRating() - 1;
  const details = msg.channel.guild.detailsOfUser(user);
  if (details) {
    if ((new Date().valueOf() - new Date(details.joinedAt).valueOf()) >= 2592000000) score += 1; //if user has been on the server for at least one month +1
  }
  if (msg.channel.permissionsFor(user).hasPermission('MANAGE_GUILD')) score += 1; //admins get +1 ;)
  let count = 0;
  bot.guilds.map(server=>{ if (server.members.includes(user)) count += 1; }); //how many servers does the bot share with them
  if (count > 2) score += 1; //if we share at least 3 servers
  if (!user.avatarURL) score -= 1; //gotta have an avatar
  if (user.username.length > 22) score -= 1; //long usernames are hard to type so -1
  if (score > 10) score = 10; else if (score < 1) score = 1; //keep it within 1-10
  Ratings[fullName.toLowerCase()] = score;
  return score;
}

function generateJSONRating(fullName) {
  const ranking = waifus[fullName];
  const ranges = {
    '1': '1-4', '2': '2-4',
    '3': '4-8', '4': '4-8',
    '5': '5-8', '6': '6-9',
    '7': '7-10', '8': '8-10',
    '9': '10-10'
  };
  let score = Math.floor((Math.random() * ((parseInt(ranges[ranking].split('-')[1], 10) + 1 - parseInt(ranges[ranking].split('-')[0], 10)))) + parseInt(ranges[ranking].split('-')[0], 10));
  const moreRandom = Math.floor(Math.random() * 4); //0-3
  if (score > 1 && moreRandom === 0) score -= 1; else if (score < 10 && moreRandom === 3) score += 1;
  Ratings[fullName.toLowerCase()] = score;
  return score;
}

module.exports = {
  commands: {
    'anime': {
      description: 'Get details on an anime from MAL.',
      //      usage: "<anime name>",
      //      deleteCommand: true,
      //      cooldown: 6,
      fn: function(msg, suffix) {
        const MAL_USER = getConfig().weeb.mal_user;
        const MAL_PASS = getConfig().weeb.mal_pass;
        if (suffix) {
          if (!MAL_USER || !MAL_PASS || MAL_USER === '' || MAL_PASS === '') {
            msg.channel.sendMessage('MAL login not configured by bot owner', function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
            return;
          }
          if (/[\uD000-\uF8FF]/g.test(suffix)) {
            msg.channel.sendMessage('Your search contained illegal characters', (e, m) => { bot.deleteMessage(m, { 'wait': 8000 }); });
            return;
          }
          //bot.startTyping(msg.channel);
          const rUrl = `http://myanimelist.net/api/anime/search.xml?q=${suffix}`;
          request(rUrl, { 'auth': { 'user': MAL_USER, 'pass': MAL_PASS, 'sendImmediately': false } }, function(error, response, body) {
            if (error) console.log(error);
            else if (!error && response.statusCode == 200) {
              xml2js.parseString(body, function(err, result) {
                const title = result.anime.entry[0].title;
                const english = result.anime.entry[0].english;
                const ep = result.anime.entry[0].episodes;
                const score = result.anime.entry[0].score;
                const type = result.anime.entry[0].type;
                const status = result.anime.entry[0].status;
                let synopsis = result.anime.entry[0].synopsis.toString();
                const id = result.anime.entry[0].id;
                synopsis = ent.decodeHTML(synopsis.replace(/<br \/>/g, ' ').replace(/\[(.{1,10})\]/g, '').replace(/\r?\n|\r/g, ' ').replace(/\[(i|\/i)\]/g, '*').replace(/\[(b|\/b)\]/g, '**'));
                if (!msg.channel.isPrivate && synopsis.length > 400)
                  synopsis = synopsis.substring(0, 400) + '...';
                msg.channel.sendMessage('**' + title + ' / ' + english + '**\n**Type:** ' + type + ' **| Episodes:** ' + ep + ' **| Status:** ' + status + ' **| Score:** ' + score + '\n' + synopsis + '\n**<http://www.myanimelist.net/anime/' + id + '>**');
              });
            } else msg.channel.sendMessage('"' + suffix + '" not found.', function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
          });
          //bot.stopTyping(msg.channel);
        } else {
          msg.author.sendMessage('`' + getConfig().trigger + 'anime` command usage: `<anime name>`');
        }
      }
    },
    'manga': {
      description: 'Get details on a manga from MAL.',
      //      usage: "<manga/novel name>",
      //      deleteCommand: true,
      //      cooldown: 6,
      fn: function(msg, suffix) {
        const MAL_USER = getConfig().weeb.mal_user;
        const MAL_PASS = getConfig().weeb.mal_pass;
        if (suffix) {
          if (!MAL_USER || !MAL_PASS || MAL_USER === '' || MAL_PASS === '') {
            msg.channel.sendMessage('MAL login not configured by bot owner', function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
            return;
          }
          if (/[\uD000-\uF8FF]/g.test(suffix)) {
            msg.channel.sendMessage('Your search contained illegal characters', (e, m) => { bot.deleteMessage(m, { 'wait': 8000 }); });
            return;
          }
          //bot.startTyping(msg.channel);
          const rUrl = `http://myanimelist.net/api/manga/search.xml?q=${suffix}`;
          request(rUrl, { 'auth': { 'user': MAL_USER, 'pass': MAL_PASS, 'sendImmediately': false } }, function(error, response, body) {
            if (error) console.log(error);
            else if (!error && response.statusCode == 200) {
              xml2js.parseString(body, function(err, result) {
                const title = result.manga.entry[0].title;
                const english = result.manga.entry[0].english;
                const chapters = result.manga.entry[0].chapters;
                const volumes = result.manga.entry[0].volumes;
                const score = result.manga.entry[0].score;
                const type = result.manga.entry[0].type;
                const status = result.manga.entry[0].status;
                let synopsis = result.manga.entry[0].synopsis.toString();
                const id = result.manga.entry[0].id;
                synopsis = ent.decodeHTML(synopsis.replace(/<br \/>/g, ' ').replace(/\[(.{1,10})\]/g, '').replace(/\r?\n|\r/g, ' ').replace(/\[(i|\/i)\]/g, '*').replace(/\[(b|\/b)\]/g, '**'));
                if (!msg.channel.isPrivate && synopsis.length > 400)
                  synopsis = synopsis.substring(0, 400) + '...';
                msg.channel.sendMessage(`**${title} / ${english}**\n**Type:** ${type} **| Chapters:** ${chapters} **| Volumes:** ${volumes} **| Status:** ${status} **| Score:** ${score}\n${synopsis}\n**<http://www.myanimelist.net/manga/${id}>**`);
              });
            } else msg.channel.sendMessage('"' + suffix + '" not found', function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
          });
          //bot.stopTyping(msg.channel);
        } else {
          msg.author.sendMessage('`' + getConfig().trigger + 'manga` command usage: `<manga/novel name>`');
        }
      }
    },
    'maluser': {
      description: "Get details on a user's MAL.",
      //      usage: "<username>",
      //      deleteCommand: true,
      //      cooldown: 6,
      fn: function(msg, suffix) {
        if (suffix) {
          if (/[\uD000-\uF8FF]/g.test(suffix)) {
            msg.channel.sendMessage('Your search contained illegal characters', (e, m) => { bot.deleteMessage(m, { 'wait': 8000 }); });
            return;
          }
          const rUrl = `http://myanimelist.net/malappinfo.php?u=${suffix.replace(/ /g, '%20')}&status=all&type=anime`;
          request(rUrl, (error, response, body) => {
            if (error) console.log(error);
            else if (!error && response.statusCode == 200) {
              xml2js.parseString(body, (err, result) => {
                if (err) console.log(err);
                else if (!result.myanimelist.myinfo) msg.channel.sendMessage(result.myanimelist.error, (e, m) => { bot.deleteMessage(m, { 'wait': 8000 }); });
                else {
                  result = result.myanimelist.myinfo[0];
                  msg.channel.sendMessage(`\`\`\`ruby\nUser: ${result.user_name} (${result.user_id})\nWatching: ${result.user_watching}\nCompleted: ${result.user_completed}\nOn Hold: ${result.user_onhold}\nDropped: ${result.user_dropped}\nPTW: ${result.user_plantowatch}\nDays Spent Watching: ${result.user_days_spent_watching}\`\`\``);
                }
              });
            }
          });
        } else {
          msg.author.sendMessage('`' + getConfig().trigger + 'maluser` command usage: `<username>`');
        }
      }
    },
    'coinflip': {
      description: 'Flip a coin.',
      fn: function(msg) {
        msg.channel.sendMessage('**' + msg.author.username.replace(/@/g, '@\u200b') + '** flipped a coin and got **' + (Math.floor(Math.random() * (2)) === 0 ? 'Heads' : 'Tails') + '**');
      }
    },
    'osu': { // GOD DAMN THIS IS BIG
      description: 'Commands to fetch osu! data.',
      //      usage: "[mode] sig [username] [hex color] | [mode] <user|best|recent> [username]",
      //      info: "**sig:** Get an osu!next styled signature for the specified account. You may provide a hex color.\n**user:** Get the statistics for a user.\n**best:** Get the top 5 plays for a user (by PP).\n**recent:** Get the 5 most recent plays for a user.\n**mode:** Mode can be used if you want to get data for a mode other than osu. You can use mania, taiko, or ctb.",
      //      deleteCommand: true, cooldown: 5,
      fn: function(msg, suffix) {
        if (!suffix) {
          msg.author.sendMessage('`' + getConfig().trigger + 'osu` command usage: `[mode] sig [username] [hex color] | [mode] <user|best|recent> [username]`');
          return;
        }

        const OSU_API_KEY = getConfig().weeb.osu_api_key;

        let osu;
        if (/^(osu!?)?(standard|mania|taiko|ctb|catch the beat) .{3,6} /i.test(suffix)) {
          if (suffix.replace(/^(osu!?)?(standard|mania|taiko|ctb|catch the beat) /i, '').startsWith('sig')) {
            if (/^(osu!?)?mania/i.test(suffix)) osu = '3';
            else if (/^(osu!?)?(ctb|catch the beat)/i.test(suffix)) osu = '2';
            else if (/^(osu!?)?taiko/i.test(suffix)) osu = '1';
          } else {
            if (!OSU_API_KEY || OSU_API_KEY === '') {
              msg.channel.sendMessage('Osu API key not configured by bot owner', (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
              return;
            }
            if (/^(osu!?)?mania/i.test(suffix)) osu = new osuapi.Api(OSU_API_KEY, osuapi.Modes.osumania);
            else if (/^(osu!?)?(ctb|catch the beat)/i.test(suffix)) osu = new osuapi.Api(OSU_API_KEY, osuapi.Modes.CtB);
            else if (/^(osu!?)?taiko/i.test(suffix)) osu = new osuapi.Api(OSU_API_KEY, osuapi.Modes.taiko);
            else osu = new osuapi.Api(OSU_API_KEY);
          }
          suffix = suffix.replace(/^(osu!?)?(standard|mania|taiko|ctb|catch the beat) /i, '');
        } else {
          if (suffix.startsWith('sig')) osu = false;
          else {
            if (!OSU_API_KEY || OSU_API_KEY === '') {
              msg.channel.sendMessage('Osu API key not configured by bot owner', (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
              return;
            }
            osu = new osuapi.Api(OSU_API_KEY);
          }
        }

        if (suffix.split(' ')[0] === 'sig') {

          let color = 'ff66aa',
            username = msg.author.username;
          suffix = suffix.split(' ');
          suffix.shift();
          if (suffix && suffix.length >= 1) {
            if (/(.*) #?[A-Fa-f0-9]{6}$/.test(suffix.join(' '))) {
              username = suffix.join('%20').substring(0, suffix.join('%20').lastIndexOf('%20'));
              if (suffix[suffix.length - 1].length == 6) {
                color = suffix[suffix.length - 1];
              } else if (suffix[suffix.length - 1].length == 7) { color = suffix[suffix.length - 1].substring(1); }
            } else if (/#?[A-Fa-f0-9]{6}$/.test(suffix.join(' '))) {
              username = msg.author.username;
              if (suffix[0].length == 6) {
                color = suffix[0];
              } else if (suffix[0].length == 7) { color = suffix[0].substring(1); }
            } else { username = suffix.join('%20'); }
          }
          let url = 'https://lemmmy.pw/osusig/sig.php?colour=hex' + color + '&uname=' + username + '&pp=2&flagshadow&xpbar&xpbarhex&darktriangles';
          if (osu) url += '&mode=' + osu;
          request({ url: url, encoding: null }, (err, response, body) => {
            if (err) {
              msg.channel.sendMessage('Error: ' + err, function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
              return;
            }
            if (response.statusCode != 200) {
              msg.channel.sendMessage('Got status code ' + response.statusCode, function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
              return;
            }
            msg.channel.sendMessage("Here's your osu signature for **" + username.replace(/@/g, '@\u200b') + '**! Get a live version at `lemmmy.pw/osusig/`');
            msg.channel.sendFile(body, 'sig.png');
          });

        } else if (suffix.split(' ')[0] == 'user') {

          const username = (suffix.split(' ').length < 2) ? msg.author.username : suffix.substring(5);
          osu.getUser(username, (err, data) => {
            if (err) msg.channel.sendMessage('Error: ' + err, function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
            if (!data) msg.channel.sendMessage('User "' + username + '" not found', function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
            else {
              if (data.playcount === null || data.playcount === 0) {
                msg.channel.sendMessage('User has no data', (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
                return;
              }
              const toSend = [];
              toSend.push('User: ' + data.username.replace(/@/g, '@\u200b') + ' (' + data.country + ')');
              toSend.push('Play Count: ' + data.playcount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Level: ' + data.level.substring(0, data.level.split('.')[0].length + 3));
              toSend.push('Ranked Score: ' + data.ranked_score.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
              toSend.push('Total Score: ' + data.total_score.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
              toSend.push('PP: ' + data.pp_raw.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','));
              toSend.push('Rank: #' + data.pp_rank.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' (Country Rank: #' + data.pp_country_rank.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ')');
              toSend.push('Accuracy: ' + data.accuracy.substring(0, data.accuracy.split('.')[0].length + 3) + '%');
              toSend.push('300s: ' + data.count300.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | 100s: ' + data.count100.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | 50s: ' + data.count50.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | SS: ' + data.count_rank_ss + ' | S: ' + data.count_rank_s + ' | A: ' + data.count_rank_a.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
              msg.channel.sendMessage('```xl\n' + toSend.join('\n') + '```');
            }
          });

        } else if (suffix.split(' ')[0] === 'best') {

          const username = (suffix.split(' ').length < 2) ? msg.author.username : suffix.substring(5);
          osu.getUserBest(username, function(err, data) {
            if (err) {
              msg.channel.sendMessage('Error: ' + err, function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
              return;
            }
            if (!data || !data[0] || !data[1] || !data[2] || !data[3] || !data[4]) {
              msg.channel.sendMessage('User "' + username + "\" not found or user doesn't have 5 plays", function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
              return;
            }
            const toSend = [];
            toSend.push('```ruby\nTop 5 for ' + username.replace(/@/g, '@\u200b') + ':');
            osu.getBeatmap(data[0].beatmap_id, (err, map1) => {

              toSend.push('1.# ' + map1.title + ' (?' + map1.difficultyrating.substring(0, map1.difficultyrating.split('.')[0].length + 3) + ')\n\tPP: ' + Math.round(data[0].pp.split('.')[0]) + ' | Rank: ' + data[0].rank + ' | Score: ' + data[0].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Max Combo: ' + data[0].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[0].countmiss + ' | Date: ' + data[0].date);

              osu.getBeatmap(data[1].beatmap_id, (err, map2) => {

                toSend.push('2.# ' + map2.title + ' (?' + map2.difficultyrating.substring(0, map2.difficultyrating.split('.')[0].length + 3) + ')\n\tPP: ' + Math.round(data[1].pp.split('.')[0]) + ' | Rank: ' + data[1].rank + ' | Score: ' + data[1].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Max Combo: ' + data[1].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[1].countmiss + ' | Date: ' + data[1].date);

                osu.getBeatmap(data[2].beatmap_id, (err, map3) => {

                  toSend.push('3.# ' + map3.title + ' (?' + map3.difficultyrating.substring(0, map3.difficultyrating.split('.')[0].length + 3) + ')\n\tPP: ' + Math.round(data[2].pp.split('.')[0]) + ' | Rank: ' + data[2].rank + ' | Score: ' + data[2].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Max Combo: ' + data[2].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[2].countmiss + ' | Date: ' + data[2].date);

                  osu.getBeatmap(data[3].beatmap_id, (err, map4) => {

                    toSend.push('4.# ' + map4.title + ' (?' + map4.difficultyrating.substring(0, map4.difficultyrating.split('.')[0].length + 3) + ')\n\tPP: ' + Math.round(data[3].pp.split('.')[0]) + ' | Rank: ' + data[3].rank + ' | Score: ' + data[3].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Max Combo: ' + data[3].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[3].countmiss + ' | Date: ' + data[3].date);

                    osu.getBeatmap(data[4].beatmap_id, (err, map5) => {

                      toSend.push('5.# ' + map5.title + ' (?' + map5.difficultyrating.substring(0, map5.difficultyrating.split('.')[0].length + 3) + ')\n\tPP: ' + Math.round(data[4].pp.split('.')[0]) + ' | Rank: ' + data[4].rank + ' | Score: ' + data[4].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Max Combo: ' + data[4].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[4].countmiss + ' | Date: ' + data[4].date);
                      msg.channel.sendMessage(toSend.join('\n') + '```');
                    });
                  });
                });
              });
            });
          });

        } else if (suffix.split(' ')[0] === 'recent') {

          const username = (suffix.split(' ').length < 2) ? msg.author.username : suffix.substring(7);
          osu.getUserRecent(username, function(err, data) {
            if (err) {
              msg.channel.sendMessage('Error: ' + err, function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
              return;
            }
            if (!data || !data[0]) {
              msg.channel.sendMessage('User "' + username + '" not found or no recent plays', function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
              return;
            }
            const toSend = [];
            toSend.push('```ruby\n5 most recent plays for ' + username.replace(/@/g, '@\u200b') + ':');
            osu.getBeatmap(data[0].beatmap_id, (err, map1) => {

              if (!map1 || !map1.title) {
                msg.channel.sendMessage(toSend + '```');
                return;
              }
              toSend.push('1.# ' + map1.title + ' (?' + map1.difficultyrating.substring(0, map1.difficultyrating.split('.')[0].length + 3) + ')\n\tScore: ' + data[0].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Rank: ' + data[0].rank + ' | Max Combo: ' + data[0].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[0].countmiss);
              if (!data[1]) {
                msg.channel.sendMessage(toSend.join('\n') + '```');
                return;
              }

              osu.getBeatmap(data[1].beatmap_id, (err, map2) => {

                if (!map2 || !map2.title) {
                  msg.channel.sendMessage(toSend);
                  return;
                }
                toSend.push('2.# ' + map2.title + ' (?' + map2.difficultyrating.substring(0, map2.difficultyrating.split('.')[0].length + 3) + ')\n\tScore: ' + data[1].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Rank: ' + data[1].rank + ' | Max Combo: ' + data[1].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[1].countmiss);
                if (!data[2]) {
                  msg.channel.sendMessage(toSend.join('\n') + '```');
                  return;
                }

                osu.getBeatmap(data[2].beatmap_id, (err, map3) => {

                  if (!map3 || !map3.title) {
                    msg.channel.sendMessage(toSend);
                    return;
                  }
                  toSend.push('3.# ' + map3.title + ' (?' + map3.difficultyrating.substring(0, map3.difficultyrating.split('.')[0].length + 3) + ')\n\tScore: ' + data[2].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Rank: ' + data[2].rank + ' | Max Combo: ' + data[2].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[2].countmiss);
                  if (!data[3]) {
                    msg.channel.sendMessage(toSend.join('\n') + '```');
                    return;
                  }

                  osu.getBeatmap(data[3].beatmap_id, (err, map4) => {

                    if (!map4 || !map4.title) {
                      msg.channel.sendMessage(toSend);
                      return;
                    }
                    toSend.push('4.# ' + map4.title + ' (?' + map4.difficultyrating.substring(0, map4.difficultyrating.split('.')[0].length + 3) + ')\n\tScore: ' + data[3].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Rank: ' + data[3].rank + ' | Max Combo: ' + data[3].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[3].countmiss);
                    if (!data[4]) {
                      msg.channel.sendMessage(toSend.join('\n') + '```');
                      return;
                    }

                    osu.getBeatmap(data[4].beatmap_id, (err, map5) => {

                      if (!map5 || !map5.title) {
                        msg.channel.sendMessage(toSend);
                        return;
                      }
                      toSend.push('5.# ' + map5.title + ' (?' + map5.difficultyrating.substring(0, map5.difficultyrating.split('.')[0].length + 3) + ')\n\tScore: ' + data[4].score.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Rank: ' + data[4].rank + ' | Max Combo: ' + data[4].maxcombo.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' | Misses: ' + data[4].countmiss);
                      msg.channel.sendMessage(toSend.join('\n') + '```');
                    });
                  });
                });
              });
            });
          });

        } else {
          msg.author.sendMessage('`' + getConfig().trigger + 'osu` command usage: *[mode] sig [username] [hex color] | [mode] <user|best|recent> [username]*');
        }
      }
    },
    'google': {
      description: 'Let me Google that for you',
      fn: function(msg, suffix) {
        if (!suffix) {
          msg.channel.sendMessage('<http://www.lmgtfy.com/?q=bot-chan+commands>');
          return;
        }
        suffix = suffix.split(' ');
        for (let i = 0; i < suffix.length; i++) suffix[i] = encodeURIComponent(suffix[i]);
        msg.channel.sendMessage(`<http://www.lmgtfy.com/?q=${suffix.join('+')}>`);
      }
    },
    'numberfacts': {
      description: 'Get facts about a number',
      fn: function(msg, suffix) {
        let number = 'random';
        if (suffix && /^\d+$/.test(suffix)) number = suffix;
        request('http://numbersapi.com/' + number + '/trivia?json', function(error, response, body) {
          if (error) msg.channel.sendMessage('Error: ' + error, function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
          else if (response.statusCode != 200) msg.channel.sendMessage('Got status code ' + response.statusCode, function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
          else {
            body = JSON.parse(body);
            msg.channel.sendMessage(body.text);
          }
        });
      }
    },
    'ratewaifu': {
      description: "I'll rate your waifu",
      //      usage: "<name> [--s[earch]]",
      //      deleteCommand: false, cooldown: 5,
      fn: function(msg, suffix) {
        if (!suffix) {
          correctUsage(msg.author, 'ratewaifu', '<name> [--s[earch]]');
          return;
        }
        if (msg.everyoneMentioned) {
          msg.channel.sendMessage('Hey, ' + msg.author.username.replace(/@/g, '@\u200b') + ", don't do that ok?", function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
          return;
        }
        if (msg.mentions.length > 1) {
          msg.channel.sendMessage("Multiple mentions aren't allowed!", (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
          return;
        }
        if (suffix.toLowerCase().replace('-', ' ') == bot.user.username.toLowerCase().replace('-', ' ')) {
          msg.channel.sendMessage("I'd rate myself **10/10**");
          return;
        }
        let fullName = '',
          user = false;
        if (suffix.search(/--s(earch)?/i) > -1) {
          const showBase = (suffix.search(/--b(ase)?/i) > -1) ? true : false;
          const query = suffix.replace(/--s(earch)?/i, '').replace(/--b(ase)?/i, '').toLowerCase().trim();
          const results = ['__Results:__'];
          Object.keys(waifus).map(name => {
            if (name.toLowerCase().includes(query)) { if(showBase) results.push(waifus[name] + ', ' + name); else results.push(name); }
          });
          if (results.length > 1) {
            if (results.join('\n').length < 2000) msg.channel.sendMessage(results.join('\n'));
            else msg.channel.sendMessage(results.join('\n').substr(0, 2000));
          } else msg.channel.sendMessage('No names found matching that in the database');
        } else {
          if (!msg.channel.isPrivate) {
            user = msg.channel.guild.members.find((member) => {
              return (member === undefined || member.username === undefined) ? false : member.username.toLowerCase() == suffix.toLowerCase();
            });
          } else user = false;
          if (!user && msg.mentions.length < 1) {
            Object.keys(waifus).map(name => {
              if (name.toLowerCase() == suffix.toLowerCase()) {
                fullName = name;
                return;
              }
            });
            if (!fullName) {
              Object.keys(waifus).map(name => {
                if (name.split(' ')[0].toLowerCase() == suffix.toLowerCase()) {
                  fullName = name;
                  return;
                }
              });
            }
            if (!fullName) {
              Object.keys(waifus).map(name => {
                if (name.split(' ').length > 1) {
                  for (let i = 1; i < name.split(' ').length; i++) {
                    if (name.split(' ')[i].toLowerCase() == suffix.toLowerCase()) {
                      fullName = name;
                      return;
                    }
                  }
                }
              });
            }
          } else {
            if (msg.mentions.length > 0) {
              fullName = msg.mentions[0].username;
              if (msg.mentions[0].username == bot.user.username) {
                msg.channel.sendMessage("I'd rate myself **10/10**");
                return;
              }
            } else if (user) fullName = user.username;
          }
          if (fullName) {
            if (Ratings.hasOwnProperty(fullName.toLowerCase())) msg.channel.sendMessage('I gave ' + fullName + ' a **' + Ratings[fullName.toLowerCase()] + '/10**'); //already rated
            else {
              if (user || msg.mentions.length > 0) msg.channel.sendMessage("I'd rate " + fullName.replace(/@/g, '@\u200b') + ' **' + generateUserRating(msg, fullName) + '/10**');
              else msg.channel.sendMessage(`I'd rate ${fullName.replace(/@/g, '@\u200b')} **${generateJSONRating(fullName)}/10**`);
            }
          } else {
            if (Ratings.hasOwnProperty(suffix.toLowerCase())) msg.channel.sendMessage(`I gave ${suffix} a **${Ratings[suffix.toLowerCase()]}/10**`); //already rated
            else msg.channel.sendMessage(`I give ${suffix.replace(/@/g, '@\u200b')} a **${generateRandomRating(suffix.toLowerCase(), true)}/10**`);
          }
        }
      }
    },
    'shared': {
      description: 'Get a list of servers that the bot sees a user in.',
      //      usage: "<user>",
      //      deleteCommand: true, cooldown: 7,
      fn: function(msg, suffix) {
        if (!msg.channel.isPrivate) {
          if (msg.mentions.length > 0) {
            let ss = 'none';
            bot.guilds.map(server => {
              if (server.members.includes(msg.mentions[0])) ss += ', ' + server.name;
            });
            if (ss != 'none') msg.channel.sendMessage('**Shared Servers for ' + msg.mentions[0].username.replace(/@/g, '@\u200b') + ':** `' + ss.substring(6).replace(/@/g, '@\u200b') + '`');
            else msg.channel.sendMessage("Somehow I don't share any servers with that user", (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
          } else if (suffix) {
            const usr = findUser(msg.channel.guild.members, suffix);
            if (usr) {
              let ss = 'none';
              bot.guilds.map((server) => {
                if (server.members.includes(usr)) ss += ', ' + server.name;
              });
              if (ss != 'none') msg.channel.sendMessage('**Shared Servers for ' + usr.username.replace(/@/g, '@\u200b') + ':** `' + ss.substring(6).replace(/@/g, '@\u200b') + '`');
              else msg.channel.sendMessage("Somehow I don't share any servers with that user", (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
            } else msg.channel.sendMessage('User not found', (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
          } else {
            correctUsage(msg.author, 'shared', '<user>');
          }
        } else msg.channel.sendMessage("This command can't be used in a PM", (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
      }
    },
    'image': {
      description: 'Get an image from Imgur',
      //      usage: "<subreddit> [--nsfw] [--day | --week | --month | --year | --all]",
      //      deleteCommand: false, cooldown: 10,
      //      info: "Avalible parameters are:\n\t`--nsfw` for getting NSFW images\n\t`--month` or other ranges for time ranges",
      fn: function(msg, suffix) {
        const IMGUR_CLIENT_ID = getConfig().weeb.imgur_client_id;
        if (!IMGUR_CLIENT_ID || IMGUR_CLIENT_ID === '') {
          msg.channel.sendMessage('No API key defined by bot owner', function(erro, wMessage) { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
          return;
        }
        if (/[\uD000-\uF8FF]/g.test(suffix)) {
          msg.channel.sendMessage('Search cannot contain unicode characters.', (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 8000 }); });
          return;
        }
        if (suffix && /^[^-].*/.test(suffix)) {
          const time = (/(--day|--week|--month|--year|--all)/i.test(suffix)) ? /(--day|--week|--month|--year|--all)/i.exec(suffix)[0] : '--week';
          const sendNSFW = (/ ?--nsfw/i.test(suffix)) ? true : false;
          if (!msg.channel.isPrivate && sendNSFW && !getConfig().weeb.allowNSFW) {
            msg.channel.sendMessage("This server doesn't have NSFW images allowed");
            return;
          }
          request({
            url: `https://api.imgur.com/3/gallery/r/${suffix.replace(/(--day|--week|--month|--year|--all|--nsfw|\/?r\/| )/gi, '')}/top/${time.substring(2)}/50`,
            headers: { 'Authorization': 'Client-ID ' + IMGUR_CLIENT_ID }
          }, (error, response, body) => {
            if (error) {
              console.log(error);
              msg.channel.sendMessage('Oh no! There was an error!');
            } else if (response.statusCode != 200) msg.channel.sendMessage('Got status code ' + response.statusCode, (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
            else if (body) {
              body = JSON.parse(body);
              if (body.hasOwnProperty('data') && body.data !== undefined && body.data.length !== 0) {
                for (let i = 0; i < 100; i++) {
                  const toSend = body.data[Math.floor(Math.random() * (body.data.length))];
                  if (!sendNSFW && !toSend.nsfw) {
                    if (toSend.title) msg.channel.sendMessage(`${toSend.link} ${toSend.title}`);
                    else msg.channel.sendMessage(toSend.link);
                    break;
                  } else if (sendNSFW && toSend.nsfw === true) {
                    if (toSend.title) msg.channel.sendMessage(`${toSend.link} **(NSFW)** ${toSend.title}`);
                    else msg.channel.sendMessage(toSend.link + ' **(NSFW)**');
                    break;
                  }
                }
              } else msg.channel.sendMessage('Nothing found!', (erro, wMessage) => { bot.deleteMessage(wMessage, { 'wait': 10000 }); });
            }
          });
        } else {
          correctUsage(msg.author, 'image', '<subreddit> [--nsfw] [--day | --week | --month | --year | --all]');
        }
      }
    },
    'fortune': {
      description: 'Get a fortune. The available categories are: all, computers, cookie, definitions, miscellaneous, people, platitudes, politics, science, and wisdom.',
      //      usage: "[category]",
      //      info: "Get a fortune from `yerkee.com/api`.\nThe avalible categories are: all, computers, cookie, definitions, miscellaneous, people, platitudes, politics, science, and wisdom.",
      //      deleteCommand: false,
      //      cooldown: 10,
      fn: function(msg, suffix) {
        let cat = 'wisdom';
        if (suffix && /^(all|computers|cookie|definitions|miscellaneous|people|platitudes|politics|science|wisdom)$/i.test(suffix.trim())) cat = suffix.trim();
        request.get('http://www.yerkee.com/api/fortune/' + cat, (e, r, b) => {
          if (e) msg.channel.sendMessage('Got an error: ' + e);
          else if (r.statusCode !== 200) msg.channel.sendMessage('Got status code ' + r.statusCode);
          else {
            b = JSON.parse(b);
            if (b.hasOwnProperty('fortune') && b.fortune !== undefined) msg.channel.sendMessage('' + msg.author.username.replace(/@/g, '@\u200b') + ',\n' + b.fortune);
            else msg.channel.sendMessage('No data was returned from the API');
          }
        });
      }
    },
    'inrole': {
      description: 'Get a list of the users in a role',
      //      usage: "<role name>",
      //      deleteCommand: true, cooldown: 3,
      fn: function(msg, suffix) {
        if (msg.channel.isPrivate) {
          msg.channel.sendMessage('Maybe try that in a server?');
          return;
        }
        if (msg.everyoneMentioned || suffix == 'everyone') msg.channel.sendMessage("Yeah right, like I'd let you do that", (e, m) => { bot.deleteMessage(m, { 'wait': 6000 }); });
        else if (suffix) {
          const role = msg.channel.guild.roles.find(r => suffix.toLowerCase() == r.name.toLowerCase());
          if (!role) msg.channel.sendMessage('Role not found', (e, m) => { bot.deleteMessage(m, { 'wait': 6000 }); });
          else {
            const withRole = msg.channel.guild.usersWithRole(role);
            if (withRole.length > 0) msg.channel.sendMessage('Users in role "' + suffix.replace(/@/g, '@\u200b') + '":' + withRole.map(u => ' ' + u.username.replace(/@/g, '@\u200b')));
            else msg.channel.sendMessage('No users in that role!', (e, m) => { bot.deleteMessage(m, { 'wait': 6000 }); });
          }
        } else msg.channel.sendMessage('Please specify a role', (e, m) => { bot.deleteMessage(m, { 'wait': 6000 }); });
      }
    },
    'currency': {
      description: 'Convert between currencies',
//      usage: "<amount> <CODE> to <CODE>",
//      deleteCommand: true, cooldown: 6,
      fn: function(msg, suffix) {
        if (!suffix)
          correctUsage(msg.author, 'currency', '<amount> <CODE> to <CODE>');
        else {
          const parsed = suffix.match(/(\d+\.?\d?\d?) ?([a-zA-Z]{3}).*([a-zA-Z]{3})$/);
          if (!parsed || parsed.length !== 4) correctUsage(msg.author, 'currency', '<amount> <CODE> to <CODE>');
          else {
            request(`https://www.google.com/finance/converter?a=${parsed[1]}&from=${parsed[2]}&to=${parsed[3]}`, (err, res, body) => {
              if (err) msg.channel.sendMessage(err);
              if (res.statusCode != 200) msg.channel.sendMessage(`Got response code ${res.statusCode}`);
              else
                msg.channel.sendMessage(`${parsed[1]} ${parsed[2]} is equal to ${body.match(/<span class=bld>(.+?)<\/span>/gmi)[0].replace(/<\/?span( class=bld)?>/g, '')}`);
            });
          }
        }
      }
    }
  }
};