'use strict';
const crypto = require('crypto'),
        http = require('http');

const Cleverbot = function () {
        this.params = Cleverbot.default_params;
    };

Cleverbot.default_params = {
    'stimulus': '', 'start': 'y', 'sessionid': '',
    'vText8': '', 'vText7': '', 'vText6': '',
    'vText5': '', 'vText4': '', 'vText3': '',
    'vText2': '', 'icognoid': 'wsf', 'icognocheck': '',
    'fno': '0', 'prevref': '', 'emotionaloutput': '',
    'emotionalhistory': '', 'asbotname': '', 'ttsvoice': '',
    'typing': '', 'lineref': '', 'sub': 'Say',
    'islearning': '1', 'cleanslate': 'false',
};
Cleverbot.parserKeys = [
    'message', 'sessionid', 'logurl', 'vText8',
    'vText7', 'vText6', 'vText5', 'vText4',
    'vText3', 'vText2', 'prevref', '',
    'emotionalhistory', 'ttsLocMP3', 'ttsLocTXT', 'ttsLocTXT3',
    'ttsText', 'lineref', 'lineURL', 'linePOST',
    'lineChoices', 'lineChoicesAbbrev', 'typingData', 'divert'
];
Cleverbot.digest = function (body) {
    const m = crypto.createHash('md5');
    m.update(body);
    return m.digest('hex');
};

Cleverbot.encodeParams = function (a1) {
    const u = [];
    for (const x in a1) {
        if (a1[x] instanceof Array)
            u.push(x + '=' + encodeURIComponent(a1[x].join(',')));
        else if (a1[x] instanceof Object)
            u.push(this.params(a1[x]));
        else
            u.push(x + '=' + encodeURIComponent(a1[x]));
    }
    return u.join('&');
};

Cleverbot.cookies = {};

Cleverbot.prepare =  function (callback) {
    const options = {
        host: 'www.cleverbot.com',
        port: 80,
        path: '/',
        method: 'GET'
    };
    const req = http.request(options, function (res) {
        res.on('data', function () {});
          if (res.headers && res.headers['set-cookie']) {
            const list = res.headers['set-cookie'];
            for (let i = 0; i < list.length; i++) {
              const single_cookie = list[i].split(';');
              const current_cookie = single_cookie[0].split('=');
              Cleverbot.cookies[current_cookie[0]] = current_cookie[1];
            }
            callback();
          }
    });
    req.end();
};

Cleverbot.prototype = {

    write: function (message, callback) {
        const clever = this;
        const body = this.params;
        body.stimulus = message;
        body.icognocheck = Cleverbot.digest(Cleverbot.encodeParams(body).substring(9, 35));
        let cookie_string = '';

        const cookie_tmp = [];
        for (const key in Cleverbot.cookies) {
            if (Cleverbot.cookies.hasOwnProperty(key)) {
                const val = Cleverbot.cookies[key];
                cookie_tmp.push(key + '=' + val);
            }
        }
        cookie_string += cookie_tmp.join(';');

        const options = {
            host: 'www.cleverbot.com',
            port: 80,
            path: '/webservicemin?uc=165&',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Cleverbot.encodeParams(body).length,
                'Cache-Control': 'no-cache',
                'Cookie': cookie_string
            }
        };
        const req = http.request(options, function (res) {
            const cb = callback || function () {
                };
            res.on('data', function (chunk) {
                const chunk_data = chunk.toString().split('\r'),
                    responseHash = {};
                for (let i = 0, iLen = chunk_data.length; i < iLen; i++) {
                    clever.params[Cleverbot.parserKeys[i]] = responseHash[Cleverbot.parserKeys[i]] = chunk_data[i];
                }
                cb(responseHash);
            });
        });
        req.write(Cleverbot.encodeParams(body));
        req.end();
    }

};

module.exports = Cleverbot;
