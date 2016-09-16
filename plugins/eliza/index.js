'use strict';

const ElizaBot = require('./ELIZA.js');
const Cleverbot = require('./../../lib/cleverbot-node');

let eliza = null;
let cleverbot = null;

module.exports = {
  name: 'eliza',
  commands: {
    'eliza': {
      fn: function(message, suffix) {
        console.log(suffix);
        if (eliza === null) {
            eliza = new ElizaBot();
            const initial = eliza.getInitial();
            message.channel.sendMessage(initial);
        } else {
            const reply = eliza.transform(suffix);
            message.channel.sendMessage(reply);
            
            if (eliza.quit) {
                eliza = null;
            }
        }
      }
    },
    'cleverbot': {
      fn: function(message, suffix) {
        console.log(suffix);
        if (cleverbot === null) {
            cleverbot = new Cleverbot();
        }
        Cleverbot.prepare(function(){
          cleverbot.write(suffix, function(response) {
            message.channel.sendMessage(response.message);
          });
        });        
      }
    },
  }
};