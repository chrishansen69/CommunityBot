'use strict';

function stack(e) {
  console.error(e.stack || e);
  return e.stack.toString() || e.toString();
}

const jsdom = require('jsdom');
const unirest = require('unirest');
const xml2js = require('../../lib/xml2js');
const rand = require('../../lib/rand.js');

/**
 * An ass function for ass substrings
 * 
 * @param  {[type]} regex
 * @param  {[type]} string
 * @param  {String} start
 * @param  {String} end
 * @return {[type]}
 */
function assMatch(regex, string, start = '', end = '') {
  const arr = string.match(regex);
  arr.forEach(function(v, k) {
    arr[k] = v.substring(start.length, v.length - end.length);
  });
  return arr;
}

function getVNData(document) {
  //const $ = window.$;

  const tableResults = document.getElementsByClassName('stripe')[0];

  if (tableResults.getElementsByTagName('tbody')[0] === undefined)
    throw "tableResults.getElementsByTagName('tbody')[0] is undefined";
  const tableis = tableResults.getElementsByTagName('tbody')[0].children;

  //if (!tableis) {
  /*const cache = [];
  console.log(JSON.stringify(document, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }));*/

  //}
  /*
   *
   * results {
   *   vnName: {
   *     mediaTypes: [
   *     ],
   *     languages: [
   *     ],
   *     releaseDate: '',
   *     popularity: '',
   *     rating: ''
   *   }/*
   * }
   *
   */
  const results = {};

  for (let j = 0, itm = tableis[0]; j < tableis.length; j++, itm = tableis[j]) {
    const vnName = itm.children[0].children[0].textContent + ' (JAP: ' + itm.children[0].children[0].title + ')';

    results[vnName] = {};
    results[vnName].mediaTypes = [];
    results[vnName].languages = [];

    for (let i = 0, length = itm.children[1].children.length; i < length; i++) {
      results[vnName].mediaTypes[i] = itm.children[1].children[i].title;
    }
    for (let i = 0, length = itm.children[2].children.length; i < length; i++) {
      results[vnName].languages[i] = itm.children[2].children[i].title;
    }
    results[vnName].releaseDate = itm.children[3].textContent;
    results[vnName].popularity = itm.children[4].textContent;
    results[vnName].rating = itm.children[5].textContent;
  }
  return results;
}

function getFirstResult(document) {
  const a = document.getElementsByClassName('tc1')[1];
  if (a)
    return a.children[0].href;
  return 'No results found.';
}

function getSingleVNData(document) {
  const tableis = document.getElementsByClassName('stripe')[0].children[0].children;
  let lines = [];

  lines.push('http:' + document.getElementsByClassName('vnimg')[0].children[0].children[0].src);

  for (let j = 0, itm = tableis[0]; j < tableis.length - 1; j++, itm = tableis[j]) {
    lines.push(
      itm.textContent // textContent abuse
      .replace(/^Title/, 'Title: ')
      .replace(/^Original title/, 'Original title: ')
      .replace(/^Aliases/, 'Aliases: ')
      .replace(/^Length/, 'Length: ')
      .replace(/^Developer/, 'Developer: ')
      .replace(/^Publishers/, 'Publishers: ')
      .replace(/^Related anime/, 'Related anime: ')
      .replace(/^Available at/, 'Available at: ')
    );
  }
  // add description
  lines.push(
    tableis[tableis.length - 1].children[0].innerHTML // might not work due to innerHTML

    .replace('<h2>Description</h2>', '')
    .replace(/<br>/g, '\n')
    .replace(/<br\/>/g, '\n') // replace newlines
    .replace(/<br \/>/g, '\n') // replace newlines
    .replace(/<\/br>/g, '') // not \n

    .replace(/<(?:.|\n)*?>/gm, '') // strip html tags
  );
  lines = lines.join('\n');
  if (lines.length > 1990) {
    lines = lines.substring(0, 1900) + '...';
  }

  return lines;
}

module.exports = {
  name: 'hansen-weeb',
  defaultCommandPrefix: 'hansen-weeb',
  commands: {
    'novel': {
      fn: function (message, suffix) {

        unirest.get('https://vndb.org/v/all?sq=' + suffix.replace(/ /g, '+'))
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            try {
              //msg.reply('```' + result.body + '```');
              console.log('RESPONSEd');

              let document = jsdom.jsdom(result.body);
              //const window = document.defaultView;

              if (document.getElementsByTagName('form').length > 1) {
                const otlink = getFirstResult(document);

                if (otlink == 'No results found.') {
                  message.channel.sendMessage('No results found.');
                  return;
                }

                console.log('RESPONSE to 2:https://vndb.org' + otlink);
                unirest.get('https://vndb.org' + otlink)
                  .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
                  .header('Accept', 'text/html,application/xhtml+xml')
                  .end(function(result) {

                    try {
                      console.log('RESPONSE 2: '/* + result.body*/);

                      document = jsdom.jsdom(result.body);
                      console.log('RESPONSE 2 parsed');

                      message.channel.sendMessage(getSingleVNData(document));
                      console.log('RESPONSE 2 sent');
                      //message.channel.sendMessage('test');
                    } catch (err) {
                      message.channel.sendMessage('ERROR (in packet 2): ```\n' + err.stack + '``` at URL: ' + otlink);
                      stack(err);
                    }

                  });

              } else {
                message.channel.sendMessage(getSingleVNData(document));
              }
            } catch (err) {
              message.channel.sendMessage('ERROR: ```\n' + err.stack + '``` at URL: ' + (result.url || ('https://vndb.org/v/all?sq=' + suffix.replace(/ /g, '+'))));
              stack(err);
            }
          });
      },
      description: 'Get info on a visual novel on VNDB'
    },
    'vndb-search': {
      fn: function (message, suffix) {

        unirest.get('https://vndb.org/v/all?sq=' + suffix.replace(/ /g, '+'))
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            try {
              //msg.reply('```' + result.body + '```');
              console.log('RESPONSE BODY: ' + result.body);

              const document = jsdom.jsdom(result.body);
              //const window = document.defaultView;

              const vndata = getVNData(document);
              let outmsg = [];

              Object.keys(vndata).forEach(function(v) {
                outmsg.push(v + ': ');
                outmsg.push('  Available on ' + vndata[v].mediaTypes.join(', '));
                outmsg.push('  Languages: ' + vndata[v].languages.join(', '));
                outmsg.push('  Released ' + vndata[v].releaseDate);
                outmsg.push('  Popularity: ' + vndata[v].popularity);
                outmsg.push('  Rating: ' + vndata[v].rating);
                outmsg.push('');
              });

              outmsg = outmsg.join('\n');
              if (outmsg.length > 1990) {
                message.channel.sendMessage('Too many search results (' + Object.keys(vndata).length + ')! Use a less broad search term.');
              } else {
                message.channel.sendMessage(outmsg);
              }
            } catch (err) {
              message.channel.sendMessage('ERROR: `' + err + '`');
              console.error(err);
            }
          });

      },
      description: 'Search for something on VNDB'
    },
    'gelbooru': {
      fn: function (message, suffix) {
        unirest.get('http://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=' + suffix.replace(/ /g, '+'))
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            xml2js.parseString(result.body, function(err, xresult) {
              if (err) {
                message.error.sendMessage('It errored: ' + err);
                console.error(JSON.stringify(err));
                return;
              }

              if (!xresult.posts.post) {
                message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
                return;
              }

              const FurryArray = [];
              if (!suffix) {
                FurryArray.push(message.author.toString() + ", you've searched for `random`");
              } else {
                FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
              }
              FurryArray.push(xresult.posts.post[Math.floor(Math.random() * xresult.posts.post.length)].$.file_url);

              message.channel.sendMessage(FurryArray);

            });
          });
      },
      description: '_Gelbooru: Like danbooru, but with slightly less porn._'
    },
    'danbooru': {
      fn: function (message, suffix) {
        unirest.get('http://danbooru.donmai.us/posts.json?tags=' + suffix.replace(/ /g, '+'))
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml') // */*
          .end(function(result) {
            const xresult = result.body;//JSON.parse(result.body);

            if (!xresult.length) {
              message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
              return;
            }

            const FurryArray = [];
            if (!suffix) {
              FurryArray.push(message.author.toString() + ", you've searched for `random`");
            } else {
              FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
            }
            FurryArray.push('http://danbooru.donmai.us' + xresult[Math.floor(Math.random() * xresult.length)].file_url);

            message.channel.sendMessage(FurryArray);

          });
      },
      description: "_Danbooru: It's mostly porn._"
    },
    'boobs': {
      fn: function(message) {
        unirest.get('http://api.oboobs.ru/boobs/' + rand(9955))
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', '*/*') // */*
          .end(function(result) {
            if (result.body[0].preview)
              message.channel.sendMessage('http://media.oboobs.ru/' + result.body[0].preview);
            else
              message.channel.sendMessage('Shit went wrong: `' + JSON.stringify(result.body) + '`');
          });
      },
      description: 'IRL boobies. (All models are over 18.)'
    },
    'butts': {
      fn: function(message) {
        unirest.get('http://api.obutts.ru/butts/' + rand(3940))
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', '*/*') // */*
          .end(function(result) {
            if (result.body[0].preview)
              message.channel.sendMessage('http://media.obutts.ru/' + result.body[0].preview);
            else
              message.channel.sendMessage('Shit went wrong: `' + JSON.stringify(result.body) + '`');
          });
      },
      description: 'IRL butts. (All models are over 18.)'
    },
    'safebooru': {
      fn: function (message, suffix) {
        unirest.get('http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=100&tags=' + suffix.replace(/ /g, '+')) // maybe tags system is different?
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            
            const xresult = assMatch(/file_url=\"([ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\%]+)\"/g,
              result.raw_body, 'file_url="', '"');

            if (!xresult.length) {
              message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
              return;
            }

            const FurryArray = [];
            if (!suffix) {
              FurryArray.push(message.author.toString() + ", you've searched for `random`");
            } else {
              FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
            }
            FurryArray.push(xresult[Math.floor(Math.random() * xresult.length)]);

            message.channel.sendMessage(FurryArray);

          });
      },
      description: 'My heart is black and my balls are blue...'
    },
    'sankaku-channel': {
      fn: function (message, suffix) {
        unirest.get('https://chan.sankakucomplex.com/?tags=' + suffix.replace(/ /g, '+') + '&commit=Search')
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            try {

              let document = jsdom.jsdom(result.body);
              //const window = document.defaultView;

              const _preview = document.getElementById('popular-preview');
              _preview.parentNode.removeChild(_preview);

              // https://c.sankakucomplex.com/data/preview/3b/ac/3bac5a04879531932ed4a38866a4064d.jpg
              // https://cs.sankakucomplex.com/data/sample/3b/ac/sample-3bac5a04879531932ed4a38866a4064d.jpg

              const xresult = document.querySelectorAll('img.preview');

              if (!xresult.length) {
                message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
                return;
              }
              //

              const FurryArray = [];
              if (!suffix) {
                FurryArray.push(message.author.toString() + ", you've searched for `random`");
              } else {
                FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
              }

              unirest.get('https://chan.sankakucomplex.com' + xresult[Math.floor(Math.random() * xresult.length)].parentNode.href)
                .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
                .header('Accept', 'text/html,application/xhtml+xml')
                .end(function(bresult) {
                  document = jsdom.jsdom(bresult.body);

                  FurryArray.push('https:' + document.getElementById('image').src);

                  message.channel.sendMessage(FurryArray);

                });

            } catch (err) {
              message.channel.sendMessage('ERROR: `' + err + '`');
              console.error(err);
            }
          });
      },
      description: 'Get an image from V&-Channel'
    },
    'sankaku-idol': {
      fn: function (message, suffix) {
        unirest.get('https://idol.sankakucomplex.com/?tags=' + suffix.replace(/ /g, '+') + '&commit=Search')
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            try {

              let document = jsdom.jsdom(result.body);
              //const window = document.defaultView;

              const _preview = document.getElementById('popular-preview');
              _preview.parentNode.removeChild(_preview);

              // https://c.sankakucomplex.com/data/preview/3b/ac/3bac5a04879531932ed4a38866a4064d.jpg
              // https://cs.sankakucomplex.com/data/sample/3b/ac/sample-3bac5a04879531932ed4a38866a4064d.jpg

              const xresult = document.querySelectorAll('img.preview');

              if (!xresult.length) {
                message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
                return;
              }
              //

              const FurryArray = [];
              if (!suffix) {
                FurryArray.push(message.author.toString() + ", you've searched for `random`");
              } else {
                FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
              }

              unirest.get('https://idol.sankakucomplex.com' + xresult[Math.floor(Math.random() * xresult.length)].parentNode.href)
                .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
                .header('Accept', 'text/html,application/xhtml+xml')
                .end(function(bresult) {
                  document = jsdom.jsdom(bresult.body);

                  FurryArray.push('https:' + document.getElementById('image').src);

                  message.channel.sendMessage(FurryArray);

                });

            } catch (err) {
              message.channel.sendMessage('ERROR: `' + err + '`');
              console.error(err);
            }
          });
      },
      description: 'Get an image from the Idol section in V&-Channel'
    },
    'konachan': {
      fn: function (message, suffix) {
        unirest.get('http://konachan.com/post.json?tags=' + suffix.replace(/ /g, '+')) // maybe tags system is different?
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {

            
            const xresult = assMatch(/\"file_url\":\"([ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\%]+)\"/g,
              result.raw_body, '"file_url":"', '"');

            if (!xresult.length) {
              message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
              return;
            }

            const FurryArray = [];
            if (!suffix) {
              FurryArray.push(message.author.toString() + ", you've searched for `random`");
            } else {
              FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
            }
            FurryArray.push(xresult[Math.floor(Math.random() * xresult.length)]);

            message.channel.sendMessage(FurryArray);

          });
      },
      description: 'Hi-res anime posters/wallpapers.'
    },
    'yande.re': {
      fn: function (message, suffix) {
        unirest.get('https://yande.re/post.json?tags=' + suffix.replace(/ /g, '+')) // maybe tags system is different?
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            
            const xresult = assMatch(/\"file_url\":\"([ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\%]+)\"/g,
              result.raw_body, '"file_url":"', '"');

            if (!xresult.length) {
              message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
              return;
            }

            const FurryArray = [];
            if (!suffix) {
              FurryArray.push(message.author.toString() + ", you've searched for `random`");
            } else {
              FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
            }
            FurryArray.push(xresult[Math.floor(Math.random() * xresult.length)]);

            message.channel.sendMessage(FurryArray);

          });
      },
      description: 'Hi-res scans and stuff.'
    },
    'ichijou': {
      fn: function (message, suffix) {
        unirest.get('http://ichijou.org/post/index.json?tags=' + suffix.replace(/ /g, '+')) // maybe tags system is different?
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            
            const xresult = assMatch(/\"file_url\":\"([ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\%]+)\"/g,
              result.raw_body, '"file_url":"', '"');

            if (!xresult.length) {
              message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
              return;
            }

            const FurryArray = [];
            if (!suffix) {
              FurryArray.push(message.author.toString() + ", you've searched for `random`");
            } else {
              FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
            }
            FurryArray.push(xresult[Math.floor(Math.random() * xresult.length)]);

            message.channel.sendMessage(FurryArray);

          });
      },
      description: 'Vector porn!'
    },
    'behoimi': {
      fn: function (message, suffix) {
        unirest.get('http://behoimi.org/post/index.json?tags=' + suffix.replace(/ /g, '+')) // maybe tags system is different?
          .header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
          .header('Accept', 'text/html,application/xhtml+xml')
          .end(function(result) {
            
            const xresult = assMatch(/\"file_url\":\"([ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\%]+)\"/g,
              result.raw_body, '"file_url":"', '"');

            if (!xresult.length) {
              message.channel.sendMessage(message.author.toString() + ', no results for `' + (suffix || 'random') + '`');
              return;
            }

            const FurryArray = [];
            if (!suffix) {
              FurryArray.push(message.author.toString() + ", you've searched for `random`");
            } else {
              FurryArray.push(message.author.toString() + ", you've searched for `" + suffix + '`');
            }
            FurryArray.push(xresult[Math.floor(Math.random() * xresult.length)]);

            message.channel.sendMessage(FurryArray);

          });
      },
      description: 'More 3D porn!'
    },
  }
};