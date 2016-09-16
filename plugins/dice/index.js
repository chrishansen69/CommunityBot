'use strict';

// Discord Bot API

function rollCommand(_message, message) {
  message = message.split(' ');

  const faces = Number(message[0]) || 100;
  const result = Math.floor(Math.random() * faces) + 1;

  _message.channel.sendMessage('Rolling `1-' + faces + '`: ' + _message.author.toString() + ' rolled a ' + result);
}

module.exports = {
  name: 'dice',
  defaultCommandPrefix: 'dice',
  commands: {
    roll: {
      fn: rollCommand,
      description: 'Rolls a dice',
      synonyms: [
        'dice'
      ]
    },
  },
};