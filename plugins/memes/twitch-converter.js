'use strict';
//  https://twitchemotes.com/api_cache/v2/images.json 


const json = require('./twitch-emotes-pre.json').images;
const out = {};
const ks = Object.keys(json);
for (let i = 0, il = ks.length; i < il; i++) {
  const k = ks[i];
  const v = json[k];
  out[v.code.toLowerCase()] = k;
}
require('fs').writeFileSync('./twitch-emotes.json', JSON.stringify(out));