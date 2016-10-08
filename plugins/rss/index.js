'use strict';

const bot = require('../../bot.js');
const perms = require('../../permissions.js');
const utility = require('../../utility.js');
const htmlCleaner = require('../../lib/html-cleaner.js');

const hash = require('./fasthash.js');

const FeedParser = require('feedparser');
const zlib = require('zlib');
const request = require('request');

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
//const HOURS = 60 * MINUTES;
//const DAYS = 24 * HOURS;

/*
const feedList = {
  'example-id': {
    url: 'http://somefeedurl/feed.xml',
    readEntries: [
      '1234345453 (post hash)',
      '1234345453 (post hash)',
      '1234345453 (post hash)'
    ],
    channel: '12314141412 (channel id to update)',
    raw: true (true or false, true will strip all html)
  }
};
*/

/*
const feedList = {
  'reddit': {
    url: 'http://reddit.com/.rss',
    readEntries: [
    ],
    channel: '182904260227366912',
    raw: true
  }
};
*/

(function() {
  const xdata = utility.xdata;

  // Create list if not exists
  if (!xdata.feedList) {
    xdata.feedList = {};
  }

  // Migration from old version of the plugin
  // Creates .channels array if .channel exists
  let save = false;
  Object.keys(xdata.feedList).forEach(function(v) {
    if (xdata.feedList[v].channel) {
      xdata.feedList[v].channels = [ xdata.feedList[v].channel ];
      delete xdata.feedList[v].channel;
      save = true;
    }
  });
  if (save)
    utility.saveXData();
})();

function fetch(feed, callback) {
  // Define our streams
  const req = request(feed, {timeout: 10000, pool: false});
  req.setMaxListeners(50);
  // Some feeds do not respond without user-agent and accept headers.
  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
  req.setHeader('accept', 'text/html,application/xhtml+xml');

  const feedparser = new FeedParser();


  // Define our handlers
  req.on('error', done);
  req.on('response', function(res) {
    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
    const encoding = res.headers['content-encoding'] || 'identity';
    const charset = getParams(res.headers['content-type'] || '').charset;
    res = maybeDecompress(res, encoding);
    res = maybeTranslate(res, charset);
    res.pipe(feedparser);
  });

  feedparser.on('error', done);
  feedparser.on('end', done);
  feedparser.on('readable', function() {
    let post;
    const meta = this.meta;

    while (true) {
      post = this.read();
      if (!post) break;

      callback(post, meta);
    }
  });
}

function maybeDecompress(res, encoding) {
  let decompress;
  if (encoding.match(/\bdeflate\b/)) {
    decompress = zlib.createInflate();
  } else if (encoding.match(/\bgzip\b/)) {
    decompress = zlib.createGunzip();
  }
  return decompress ? res.pipe(decompress) : res;
}

function maybeTranslate(res, charset) {
  //let iconv;
  // Use iconv if its not utf8 already.
  if (charset && !/utf-*8/i.test(charset)) {
    try {
      throw 'Unsupported charset: ' + charset;
      /*iconv = new Iconv(charset, 'utf-8');
      console.log('Converting from charset %s to utf-8', charset);
      iconv.on('error', done);
      // If we're using iconv, stream will be the output of iconv
      // otherwise it will remain the output of request
      res = res.pipe(iconv);*/
    } catch(err) {
      res.emit('error', err);
    }
  }
  return res;
}

function getParams(str) {
  const params = str.split(';').reduce(function (params, param) {
    const parts = param.split('=').map(function (part) { return part.trim(); });
    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }
    return params;
  }, {});
  return params;
}

function done(err) {
  if (err) {
    console.log(err, err.stack);
  }
}

function checkRSS() {
  const xdata = utility.xdata;
  const feedList = xdata.feedList;

  Object.keys(feedList).forEach(function(v, k) {

    setTimeout(function() {
      let nPost = 0;

      fetch(feedList[v].url, function(post, meta) {
        nPost++;
        //console.log(JSON.stringify(post));
        //console.log('>>> meta: ' + JSON.stringify(meta));

        // is article valid
        const thash = hash(post.title + post.description);
        if (feedList[v].readEntries.indexOf(thash) > -1) {
          return;
        }
        //console.log('article is valid');

        feedList[v].readEntries.push(thash);

        let adesc = post.description || '';

        if (feedList[v].raw) {
          adesc = htmlCleaner.stripTags(adesc); // remove all html tags
        } else {
          adesc = htmlCleaner.fixTags(adesc); // convert to markdown
        }

        let chan;
        feedList[v].channels.forEach(function(_chan, i) {
          chan = bot.channels.get(_chan);
          setTimeout(function() {
            chan.sendMessage('>>> Feed from **' + meta.title + '**:\n' + post.title + ' (' + post.link + ')\n\n' + adesc);
          }, 250 * (nPost + i)); // send a message every 250 ms
        });

      });
    }, 300 * (k + 1)); // fetch new feed every 300 ms

  });
  
  // WARNING: DUE TO ASYNC, MIGHT BE 1 UPDATE BEHIND...
  utility.saveXData();
}

setInterval(checkRSS, 30 * MINUTES);

checkRSS();

function addFeed(_url, _channel, _raw) {
  const xdata = utility.xdata;
  const hashed = hash(_url);

  if (xdata.feedList[hashed]) { // feed is in queue

    if (xdata.feedList[hashed].channels.indexOf(_channel) == -1) // feed is not in channel queue
      xdata.feedList[hashed].channels.push(_channel); // add to channel queue

  } else {
    xdata.feedList[hashed] = { // add to queue
      url: _url,
      readEntries: [
      ],
      channels: [ _channel ],
      raw: _raw
    };
  }

  utility.saveXData();
}

module.exports = {
  name: 'rss-reader',
  commands: {
    'rss-add': {
      fn: function (message, suffix) {
        if (!suffix) return;
        if (message.channel.isPrivate) return;
        if (!perms.has(message, 'minimod')) return;
        
        addFeed(suffix, message.channel.id, false);

        message.channel.sendMessage('Added feed URL `' + suffix + '`');

      },
      description: 'Track an RSS field in the current channel'
    },
    'rss-add-raw': {
      fn: function (message, suffix) {
        if (!suffix) return;
        if (message.channel.isPrivate) return;
        if (!perms.has(message, 'minimod')) return;

        addFeed(suffix, message.channel.id, true);

        message.channel.sendMessage('Added feed URL `' + suffix + '`');

      },
      description: 'Track an RSS field in the current channel (this variant will not parse HTML tags)'
    },
    'rss-remove': {
      fn: function (message, suffix) {
        if (!suffix) return;
        if (message.channel.isPrivate) return;
        if (!perms.has(message, 'minimod')) return;
        const xdata = utility.xdata;
        const hashed = hash(suffix);

        if (!xdata.feedList[hashed] || xdata.feedList[hashed].channels.indexOf(message.channel.id) == -1) {
          message.channel.sendMessage('That feed is not being tracked!');
          return;
        }

        const c = xdata.feedList[hashed].channels;
        if (!c) {
          message.channel.sendMessage('Error `xdata.feedList[hashed].channels is not defined`');
          return;
        }

        const i = c.indexOf(message.channel.id);
        if (i == -1) {
          message.channel.sendMessage('Error `channel is not in tracked list this should never happen`');
          return;
        }
        delete c[i];
        if (c.length === 0) {
          delete xdata.feedList[hashed];
        }
        message.channel.sendMessage('Removed feed URL `' + suffix + '`');

        utility.saveXData();

      },
      description: 'Remove a tracked RSS feed'
    },
    'rss-list': {
      fn: function (message) {
        message.channel.sendMessage('List of RSS feeds being tracked (across all servers):\n' + (Object.keys(utility.xdata.feedList).join('\n')));
      },
      description: 'Show a list of tracked RSS feeds'
    },
    'rss-fetch': {
      fn: function (message) {
        if (!perms.has(message, 'op')) return;

        checkRSS();
      },
      description: 'Fetch new RSS entries. Bot operators only.'
    },
  }
};