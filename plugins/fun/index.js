'use strict';

const fs = require('fs');
const bot = require('../../bot.js');
const rand = require('../../lib/rand.js');

const botStartTime = new Date();

const cenaFolder = './plugins/fun/cena/';
const cenaImages = fs.readdirSync(cenaFolder); //Loops through a given folder and creates an array of file names

const ROCK = 0;
const PAPER = 0;
const SCISSORS = 0;

let inRPS = false;
let RPS1 = '';
let RPS2 = '';
let RPS1choice = 0;
let RPS2choice = 0;

function endrps(message) {

  if (RPS1choice == RPS2choice) {
    message.channel.sendMessage(bot.messages.get(RPS1).toString() + ' ' + bot.messages.get(RPS2).toString() + " it's a tie, nobody wins!");
  } else if (
    (RPS1choice === ROCK && RPS2choice === SCISSORS) ||
    (RPS1choice === PAPER && RPS2choice === ROCK) ||
    (RPS1choice === SCISSORS && RPS2choice === PAPER)
  ) {
    message.channel.sendMessage(bot.messages.get(RPS1).toString() + ' wins!');
  } else {
    message.channel.sendMessage(bot.messages.get(RPS2).toString() + ' wins!');
  }

  RPS1choice = -1;
  RPS2choice = -1;
  RPS1 = '';
  RPS2 = '';
  inRPS = false;
}

bot.on('message', function (message) {
  if (inRPS) {
    if (message.author.id === RPS1) {
      if (message.contents === 'rock') {
        RPS1choice = ROCK;
      } else if (message.contents === 'paper') {
        RPS1choice = PAPER;
      } else if (message.contents === 'scissors') {
        RPS1choice = SCISSORS;
      }
      if (RPS1choice !== -1 && RPS2choice !== -1) {
        endrps(message);
      }
    } else if (message.author.id === RPS2) {
      if (message.contents === 'rock') {
        RPS2choice = ROCK;
      } else if (message.contents === 'paper') {
        RPS2choice = PAPER;
      } else if (message.contents === 'scissors') {
        RPS2choice = SCISSORS;
      }
      if (RPS1choice !== -1 && RPS2choice !== -1) {
        endrps(message);
      }
    }
  }
});

module.exports = {
  name: 'fun',
  commands: {
    uptime: {
      fn: function(message) { // Stolen from SDG-Discord-Bot
        const botUptime = Math.abs(new Date() - botStartTime);
        let x = botUptime / 1000;
        const uptimeSeconds = Math.floor(x % 60);
        x /= 60;
        const uptimeMinutes = Math.floor(x % 60);
        x /= 60;
        const uptimeHours = Math.floor(x % 24);
        x /= 24;
        const uptimeDays = Math.floor(x);
        message.channel.sendMessage(uptimeDays + ' days, ' + uptimeHours + ' hours, ' + uptimeMinutes + ' minutes and ' + uptimeSeconds + ' seconds');
      },
      description: 'Shows how long the bot has been running for'
    },
    cena: {
      fn: function(message) { // Stolen from SDG-Discord-Bot
        //\uD83C is the unicode trumpet
        message.channel.sendMessage('\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA');

        const cenaImage = rand.choose(cenaImages);

        message.channel.sendFile(cenaFolder + cenaImage, 'jonny.png', (err) => {
          if (err)
            console.error("couldn't send image: " + err);
        });
      },
      description: 'What\'s his name?'
    },
    koolaid: {
      fn: function(message) {
        message.channel.sendFile('./plugins/fun/meme/koolaid.jpg', 'koolaid.jpg', (err) => {
          if (err)
            console.error("couldn't send image: " + err);
        });
      },
      description: 'Memes'
    },
    machoman: {
      fn: function(message) {
        message.channel.sendMessage('**OOOOOH YEAH BROTHER**');
        message.channel.sendFile('./plugins/fun/meme/savage.jpg', 'savage.jpg', (err) => {
          if (err)
            console.error("Couldn't send image: " + err);
        });
      },
      description: 'Memes'
    },
    rps: {
      fn: function(message) {
        if (!inRPS) {
          RPS1choice = -1;
          RPS2choice = -1;
          RPS1 = message.author.id;
          console.log('length is ' + message.mentions.users.size);
          if (message.mentionsArr[0])
            RPS2 = message.mentionsArr[0].id;
          else {
            message.channel.sendMessage('Please @mention someone to challenge them!');
            return;
          }
          inRPS = true;
          message.channel.sendMessage(message.author.toString() + ' challenges ' + message.mentionsArr[0].toString() + ' to a game of Rock, Paper, Scissors! Type `rock` `paper` or `scissors`!');
        } else {
          message.channel.sendMessage('A game has already started!');
        }
      },
      description: 'Play a game of Rock, Paper, Scissors with your friend(s)!'
    },
  },
};
