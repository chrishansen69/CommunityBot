'use strict';

const fs = require('fs');
const bot = require('../../bot.js');

const botStartTime = new Date();

const cenaFolder = "./plugins/fun/cena/";
const cenaImages = fs.readdirSync(cenaFolder); //Loops through a given folder and creates an array of file names

const ROCK = 0;
const PAPER = 0;
const SCISSORS = 0;

let inRPS = false;
let RPS1 = "";
let RPS2 = "";
let RPS1choice = 0;
let RPS2choice = 0;

function uptime(message, suffix) { // Stolen from SDG-Discord-Bot
    let botUptime = Math.abs(new Date() - botStartTime);
		let x = botUptime / 1000;
		let uptimeSeconds = Math.floor(x % 60);
		x /= 60;
		let uptimeMinutes = Math.floor(x % 60);
		x /= 60;
		let uptimeHours = Math.floor(x % 24);
		x /= 24;
		let uptimeDays = Math.floor(x);
		bot.sendMessage(message.channel, message, uptimeDays + " days, " + uptimeHours + " hours, " + uptimeMinutes + " minutes and " + uptimeSeconds + " seconds");
}

function cena(message, suffix) { // Stolen from SDG-Discord-Bot
  //\uD83C is the unicode trumpet
  bot.sendMessage(message.channel, message, "\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA");
  
  const cenaImage = cenaImages[Math.floor(Math.random() * cenaImages.length)];
  
  bot.sendFile(message.channel, cenaFolder + cenaImage,"jonny.png", (err, message) => {
    if(err)
      console.error("couldn't send image: " + err);
  });
}

//KoolAid reply function
function koolaid(message) {
  bot.sendFile(message.channel, "./plugins/fun/meme/koolaid.jpg", "koolaid.jpg", (err, message) => {
    if(err)
      console.error("couldn't send image: " + err);
  });
}

//Macho Man function
function machoman(message) {
  bot.sendMessage(message.channel, message, "**OOOOOH YEAH BROTHER**");
  bot.sendFile(message.channel, "./plugins/fun/meme/savage.jpg", "savage.jpg", (err, message) => {
    if(err)
      console.error("Couldn't send image: " + err);
  });
}

function rps(message) {
  if (!inRPS) {
    RPS1choice = -1;
    RPS2choice = -1;
    RPS1 = message.sender.id;
    console.log('length is ' + message.mentions.length);
    RPS2 = message.mentions[0].id;
    inRPS = true;
    bot.sendMessage(message.channel, message.sender.mention() + ' challenges ' + message.mentions[0].mention() + ' to a game of Rock, Paper, Scissors! Type `rock` `paper` or `scissors`!')
  } else {
    bot.sendMessage(message.channel, 'A game has already started!');
  }
}

function endrps(message) {
  let winner = -1;
  
  if ((RPS1choice == RPS2choice)) {
    winner = -1;
  } else if ((RPS1choice === ROCK && RPS2choice === SCISSORS) ||
      (RPS1choice === PAPER && RPS2choice === ROCK) ||
      (RPS1choice === SCISSORS && RPS2choice === PAPER)) {
    winner = 1;
  } else winner = 2;
  
  if (winner === -1) {
    bot.sendMessage(message.channel, bot.messages.get("id", RPS1).mention() + " " + bot.messages.get("id", RPS2).mention() + " it's a tie, nobody wins!");
  } else if (winner === 1) {
    bot.sendMessage(message.channel, bot.messages.get("id", RPS1).mention() + " wins!");
  } else {
    bot.sendMessage(message.channel, bot.messages.get("id", RPS2).mention() + " wins!");
  }
  
  RPS1choice = -1;
  RPS2choice = -1;
  RPS1 = "";
  RPS2 = "";
  inRPS = false;
}

bot.on("message", function(message) {
  if (inRPS) {
    if (message.sender.id === RPS1) {
      if (message.contents === 'rock') {
        RPS1choice = ROCK;
      } else if (message.contents === 'paper') {
        RPS1choice = PAPER;
      } else if (message.contents === 'scissors') {
        RPS1choice = SCISSORS;
      }
      if (RPS1choice !== -1 && RPS2choice !== -1) {
        endrps();
      }
    } else if (message.sender.id === RPS2) {
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
            fn: uptime,
            description: 'Shows how long the bot has been running for'
        },
        cena: {
            fn: cena,
            description: 'What\'s his name?'
        },
        koolaid: {
            fn: koolaid,
            description: 'Memes'
        },
        machoman: {
            fn: machoman,
            description: 'Memes'
        },
        rps: {
            fn: rps,
            description: 'Play a game of Rock, Paper, Scissors with your friend(s)!'
        },
    },
};