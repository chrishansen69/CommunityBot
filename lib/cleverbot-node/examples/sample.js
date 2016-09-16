'use strict';
const Cleverbot = require('../lib/cleverbot');
const CBots = [new Cleverbot(),new Cleverbot()];
let i = 0;
const _name = ['Bob Loblaw', 'Stan Sitwell'];
const callback = function callback(resp){
  CBots[i].write(resp.message,callback);
  console.log(_name[i = ( ( i + 1 ) %2)],' : ',  resp.message);
};
Cleverbot.prepare(function(){
  callback({message:'Just a small town girl'});
});
