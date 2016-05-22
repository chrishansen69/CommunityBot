// Discord Bot API
const bot = require('../../bot.js');

function rollCommand(_message, message) {
    message = message.split(' ');

    const faces = Number(message[0]) || 100;
    const result = Math.floor(Math.random() * faces) + 1;

    bot.sendMessage(_message.channel, 'Rolling `1-' + faces + '`: ' + _message.sender.mention() + ' rolled a ' + result);
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