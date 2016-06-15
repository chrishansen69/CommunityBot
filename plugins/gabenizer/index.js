// Discord Bot API
'use strict';
const bot = require('../../bot.js');
const PythonShell = require('python-shell');

function gabe(_message, suffix) {
    const message = suffix.split(' ')[0];
    
    const options = {
      //mode: 'text',
      //pythonPath: 'path/to/python',
      //pythonOptions: ['-u'],
      scriptPath: './plugins/gabenizer',
      args: [message]
    };

    PythonShell.run('mentions.py', options, function(err, results) {
      if (err) {
        bot.sendMessage(_message.channel, ['Error creating Gaben!', 'Please check if your image has a face in it.', '`' + err.toString() + '`']);
        console.error(err);
        return;
        //throw err;
      }
      // results is an array consisting of messages collected during execution
      //console.log('results: %j', results);
      
      bot.sendFile(_message.channel, './plugins/gabenizer/whatfuck.png');
    });
}

module.exports = {
    name: 'gabe',
    defaultCommandPrefix: 'gabe',
    commands: {
        gabe: {
            fn: gabe,
            description: 'GABEN',
        },
    },
};