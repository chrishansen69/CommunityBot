"use strict";

const bot = require('../../bot.js');

module.exports = {
  name: 'memes',
  commands: {
    sombre: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '**`S O M B R E`**'
        );
      },
      description: 'it\'s a meme'
    },
    hawk: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '**_ C A N T S T O P T H E H A W K _**'
        );
      },
      description: 'it\'s a meme'
    },
    donger: {
      fn: function(message) {
        bot.sendMessage(message.channel, [
          '**```',
          'd8888b.  .d88b.  d8b   db  d888b  d88888b d8888b.',
          '88  `8D .8P  Y8. 888o  88 88\' Y8b 88\'     88  `8D',
          '88   88 88    88 88V8o 88 88      88ooooo 88oobY\'',
          '88   88 88    88 88 V8o88 88  ooo 88~~~~~ 88`8b  ',
          '88  .8D `8b  d8\' 88  V888 88. ~8~ 88.     88 `88.',
          'Y8888D\'  `Y88P\'  VP   V8P  Y888P  Y88888P 88   YD',
          '```**' ]
        );
      },
      description: 'it\'s a meme'
    },
    minty: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'http://i60.tinypic.com/2hzkc5y.png MINTY'
        );
      },
      description: 'it\'s a meme'
    },
    greeneggs: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '**GREEN EGGS** *`And`* **_THOUGHTS OF SUICIDE_** ( ͡° ʖ̯ ͡°)'
        );
      },
      description: 'it\'s a meme'
    },
    ieatass: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '*`ケツを食ベる`*'
        );
      },
      description: 'it\'s a meme'
    },
    logout: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'http://superlogout.com/'
        );
      },
      description: 'it\'s a meme'
    },
    wellmemed: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'http://i58.tinypic.com/2s8o4g8.png'
        );
      },
      description: 'it\'s a meme'
    },
    abuse: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'http://i.imgur.com/cAxpwdm.gif'
        );
      },
      description: 'it\'s a meme'
    },
    lenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡° ͜ʖ ͡°)'
        );
      },
      description: 'it\'s a meme'
    },
    sadlenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡° ʖ̯ ͡°)'
        );
      },
      description: 'it\'s a meme'
    },
    murica: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'http://i.imgur.com/S7yevXQ.jpg'
        );
      },
      description: 'it\'s a meme'
    },
    gottago: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '*GOTTA GO FAST* http://i61.tinypic.com/2hdmr2f.png'
        );
      },
      description: 'it\'s a meme'
    },
    mindlessretard: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'ຈل͜ຈ ɪ ᴄᴛʀʟ ᴠ ᴛʜɪɴɢs ɪɴᴛᴏ ᴄʜᴀᴛ ʙᴇᴄᴀᴜsᴇ ɪ ᴀᴍ ᴀ ᴍɪɴᴅʟᴇss ʀᴇᴛᴀʀᴅ ຈل͜ຈ'
        );
      },
      description: 'it\'s a meme'
    },
    toa: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'http://i.imgur.com/ZIUdtUw.png'
        );
      },
      description: 'it\'s a meme'
    },
    blaze: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'https://static-cdn.jtvnw.net/emoticons/v1/39567/1.0'
        );
      },
      description: 'it\'s a meme'
    },
    aero: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'https://i.imgur.com/cN9Ssfd.png'
        );
      },
      description: 'it\'s a meme'
    },
    wiselenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡ຈ╭͜ʖ╮͡ຈ )'
        );
      },
      description: 'it\'s a meme'
    },
    lenny4: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡~ ͜ʖ ͡~)'
        );
      },
      description: 'it\'s a meme'
    },
    lennywink: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡~ ͜ʖ ͡°)'
        );
      },
      description: 'it\'s a meme'
    },
    mehlenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͠° ͟ʖ ͡°)'
        );
      },
      description: 'it\'s a meme'
    },
    rapelenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡ʘ╭͜ʖ╮͡ʘ)'
        );
      },
      description: 'it\'s a meme'
    },
    eyebrowlenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͝סּ ͜ʖ͡סּ)'
        );
      },
      description: 'it\'s a meme'
    },
    asianlenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡ᵔ ͜ʖ ͡ᵔ )'
        );
      },
      description: 'it\'s a meme'
    },
    lenny10: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡^ ͜ʖ ͡^ )'
        );
      },
      description: 'it\'s a meme'
    },
    dongbill: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]'
        );
      },
      description: 'it\'s a meme'
    },
    lenny12: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡ຈ ͜ʖ ͡ຈ)'
        );
      },
      description: 'it\'s a meme'
    },
    disappointlenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡° ʖ̯ ͡°)'
        );
      },
      description: 'it\'s a meme'
    },
    buggedlenny: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡ ͜ʖ ͡ )'
        );
      },
      description: 'it\'s a meme'
    },
    lennypoint: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '(☞ ͡° ͜ʖ ͡°)☞'
        );
      },
      description: 'it\'s a meme'
    },
    lennyrun: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'ᕕ( ͡° ͜ʖ ͡° )ᕗ'
        );
      },
      description: 'it\'s a meme'
    },
    lennygroup: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ͡°) ͜ʖ ͡°)ʖ ͡°)ʖ ͡°)'
        );
      },
      description: 'it\'s a meme'
    },
    lennygive: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '(つ ͡° ͜ʖ ͡°)つ'
        );
      },
      description: 'it\'s a meme'
    },
    lenny20: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '( ͡⚆ ͜ʖ ͡⚆)'
        );
      },
      description: 'it\'s a meme'
    },
    lennynoshitsgiven: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '¯_( ͠° ͟ʖ °͠ )_/¯'
        );
      },
      description: 'it\'s a meme'
    },
    raiseordie: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          'ヽ༼ຈل͜ຈ༽ﾉ гคเรє ๏г ๔เє ヽ༼ຈل͜ຈ༽ﾉ'
        );
      },
      description: 'it\'s a meme'
    },
    nyan: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '~=[,,_,,]:3'
        );
      },
      description: 'it\'s a meme'
    },
    seed: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '**EVEN NOW... THE EVIL SEED OF WHAT YOU\'VE DONE GERMINATES WITHIN YOU**'
        );
      },
      description: 'it\'s a meme'
    },
    sniper: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '▄︻̷̿┻̿═━一'
        );
      },
      description: 'it\'s a meme'
    },
    notgivinash: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '¯_(ツ)_/¯'
        );
      },
      description: 'it\'s a meme'
    },
    ameno: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '༼ つ ◕_◕ ༽つ'
        );
      },
      description: 'it\'s a meme'
    },
    brickwall: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '┬┴┬┴┤(･_├┬┴┬┴'
        );
      },
      description: 'it\'s a meme'
    },
    mac10: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '⌐╦╦═─'
        );
      },
      description: 'it\'s a meme'
    },
    faceroll: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '(._.) ( l: ) ( .-. ) ( :l ) (._.)'
        );
      },
      description: 'it\'s a meme'
    },
    tablefix: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          '┬──┬ ノ( ゜-゜ノ)'
        );
      },
      description: 'it\'s a meme'
    },
    megarekt: {
      fn: function(message) {
        bot.sendMessage(message.channel,
          `** ☐ Not REKT 
☑ REKT 
☑ REKTangle 
☑ SHREKT 
☑ REKT-it Ralph 
☑ Total REKTall 
☑ The Lord of the REKT 
☑ The Usual SusREKTs 
☑ North by NorthREKT 
☑ REKT to the Future 
☑ Once Upon a Time in the REKT 
☑ The Good, the Bad, and the REKT 
☑ LawREKT of Arabia 
☑ Tyrannosaurus REKT 
☑ eREKTile dysfunction **`
        );
      },
      description: 'it\'s a meme'
    },
  }
};