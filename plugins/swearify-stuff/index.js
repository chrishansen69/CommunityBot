'use strict';

const endings = require('./endings.json');
const replacements = require('./replacements.js');

const misconceptions = require('./misconceptions.json');
const bibleverses = require('./bibleverses.json');
const slipsum = require('./slipsum.json');
//const hodor = require('./hodor.json');
const spaceipsum = require('./spaceipsum.json');
const bttfipsum = require('./bttfipsum.json');
const breakingbadipsum = require('./breakingbadipsum.json');
const facts = require('./facts.json');

const rand = require('../../lib/rand.js');

/////////////////////
/////////////////////LEET TEXT

function leet(new_msg) {
  return new_msg
    .replace(/a/gi, '4')
    .replace(/b/gi, '|3')
    .replace(/c/gi, '(')
    .replace(/d/gi, '|)')
    .replace(/e/gi, '3')
    .replace(/f/gi, '|=')
    .replace(/g/gi, '9')
    .replace(/h/gi, '|-|')
    .replace(/i/gi, '1')
    .replace(/j/gi, '_|')
    .replace(/k/gi, '|<')
    .replace(/l/gi, '1')
    .replace(/m/gi, '|\\/|')
    .replace(/n/gi, '|\\|')
    .replace(/o/gi, '0')
    .replace(/p/gi, '|>')
    .replace(/q/gi, '().')
    .replace(/r/gi, '|2')
    .replace(/s/gi, '5')
    .replace(/t/gi, '7')
    .replace(/u/gi, '|_|')
    .replace(/v/gi, '\\/')
    .replace(/w/gi, '\\/\\/')
    .replace(/x/gi, '><')
    .replace(/y/gi, '`/')
    .replace(/z/gi, '2');
}

//////////////////////
/////////////////////BALLOON TEXT

function balloon(new_msg) {
  return new_msg
    .replace(/a/gi, 'ⓐ')
    .replace(/b/gi, 'ⓑ')
    .replace(/c/gi, 'ⓒ')
    .replace(/d/gi, 'ⓓ')
    .replace(/e/gi, 'ⓔ')
    .replace(/f/gi, 'ⓕ')
    .replace(/g/gi, 'ⓖ')
    .replace(/h/gi, 'ⓗ')
    .replace(/i/gi, 'ⓘ')
    .replace(/j/gi, 'ⓙ')
    .replace(/k/gi, 'ⓚ')
    .replace(/l/gi, 'ⓛ')
    .replace(/m/gi, 'ⓜ')
    .replace(/n/gi, 'ⓝ')
    .replace(/o/gi, 'ⓞ')
    .replace(/p/gi, 'ⓟ')
    .replace(/q/gi, 'ⓠ')
    .replace(/r/gi, 'ⓡ')
    .replace(/s/gi, 'ⓢ')
    .replace(/t/gi, 'ⓣ')
    .replace(/u/gi, 'ⓤ')
    .replace(/v/gi, 'ⓥ')
    .replace(/w/gi, 'ⓦ')
    .replace(/x/gi, 'ⓧ')
    .replace(/y/gi, 'ⓨ')
    .replace(/z/gi, 'ⓩ')
    .replace(/1/gi, '⓵')
    .replace(/2/gi, '⓶')
    .replace(/3/gi, '⓷')
    .replace(/4/gi, '⓸')
    .replace(/5/gi, '⓹')
    .replace(/6/gi, '⓺')
    .replace(/7/gi, '⓻')
    .replace(/8/gi, '⓼')
    .replace(/9/gi, '⓽')
    .replace(/0/gi, '⓪');
}

//////////////////////
/////////////////////BRAILLE TEXT

function braille(new_msg) {
  return new_msg
    .replace(/a/gi, '⠁')
    .replace(/b/gi, '⠃')
    .replace(/c/gi, '⠉')
    .replace(/d/gi, '⠙')
    .replace(/e/gi, '⠑')
    .replace(/f/gi, '⠋')
    .replace(/g/gi, '⠛')
    .replace(/h/gi, '⠓')
    .replace(/i/gi, '⠊')
    .replace(/j/gi, '⠚')
    .replace(/k/gi, '⠅')
    .replace(/l/gi, '⠇')
    .replace(/m/gi, '⠍')
    .replace(/n/gi, '⠝')
    .replace(/o/gi, '⠕')
    .replace(/p/gi, '⠏')
    .replace(/q/gi, '⠟')
    .replace(/r/gi, '⠗')
    .replace(/s/gi, '⠎')
    .replace(/t/gi, '⠞')
    .replace(/u/gi, '⠥')
    .replace(/v/gi, '⠧')
    .replace(/w/gi, '⠺')
    .replace(/x/gi, '⠭')
    .replace(/y/gi, '⠽')
    .replace(/z/gi, '⠵')
    .replace(/1/gi, '⠼⠁')
    .replace(/2/gi, '⠼⠃')
    .replace(/3/gi, '⠼⠉')
    .replace(/4/gi, '⠼⠙')
    .replace(/5/gi, '⠼⠑')
    .replace(/6/gi, '⠼⠋')
    .replace(/7/gi, '⠼⠛')
    .replace(/8/gi, '⠼⠓')
    .replace(/9/gi, '⠼⠊')
    .replace(/0/gi, '⠼⠚');
}

//////////////////////
/////////////////////GREEKIFIED TEXT

function greek(new_msg) {
  return new_msg
    .replace(/a/gi, 'α')
    .replace(/b/gi, 'β')
    .replace(/c/gi, 'ς')
    .replace(/d/gi, 'δ')
    .replace(/e/gi, 'ε')
    .replace(/f/gi, 'ƒ')
    .replace(/g/gi, 'g')
    .replace(/h/gi, 'н')
    .replace(/i/gi, 'ι')
    .replace(/j/gi, 'j')
    .replace(/k/gi, 'κ')
    .replace(/l/gi, 'ℓ')
    .replace(/m/gi, 'м')
    .replace(/n/gi, 'η')
    .replace(/o/gi, 'ο')
    .replace(/p/gi, 'ρ')
    .replace(/q/gi, 'φ')
    .replace(/r/gi, 'я')
    .replace(/s/gi, 's')
    .replace(/t/gi, 'τ')
    .replace(/u/gi, 'μ')
    .replace(/v/gi, 'v')
    .replace(/w/gi, 'ω')
    .replace(/x/gi, 'χ')
    .replace(/y/gi, 'λ')
    .replace(/z/gi, 'ζ');
}

function smallcaps(new_msg) {
  return new_msg
    .replace(/a/gi, 'ᴀ')
    .replace(/b/gi, 'ʙ')
    .replace(/c/gi, 'ᴄ')
    .replace(/d/gi, 'ᴅ')
    .replace(/e/gi, 'ᴇ')
    .replace(/f/gi, 'ғ')
    .replace(/g/gi, 'ɢ')
    .replace(/h/gi, 'ʜ')
    .replace(/i/gi, 'ɪ')
    .replace(/j/gi, 'ᴊ')
    .replace(/k/gi, 'ᴋ')
    .replace(/l/gi, 'ʟ')
    .replace(/m/gi, 'ᴍ')
    .replace(/n/gi, 'ɴ')
    .replace(/o/gi, 'ᴏ')
    .replace(/p/gi, 'ᴘ')
    .replace(/q/gi, 'ǫ')
    .replace(/r/gi, 'ʀ')
    .replace(/s/gi, 's')
    .replace(/t/gi, 'ᴛ')
    .replace(/u/gi, 'ᴜ')
    .replace(/v/gi, 'ᴠ')
    .replace(/w/gi, 'ᴡ')
    .replace(/x/gi, 'x')
    .replace(/y/gi, 'ʏ')
    .replace(/z/gi, 'ᴢ');
}

//////////////////////
/////////////////////MORSE CODE

function morse(new_msg) {
  return new_msg
    .replace(/a/gi, '.-//')
    .replace(/b/gi, '-...//')
    .replace(/c/gi, '-.-.//')
    .replace(/d/gi, '-..//')
    .replace(/e/gi, './/')
    .replace(/f/gi, '..-.//')
    .replace(/g/gi, '--.//')
    .replace(/h/gi, '....//')
    .replace(/i/gi, '..//')
    .replace(/j/gi, '.---//')
    .replace(/k/gi, '-.-//')
    .replace(/l/gi, '.-..//')
    .replace(/m/gi, '--//')
    .replace(/n/gi, '-.//')
    .replace(/o/gi, '---//')
    .replace(/p/gi, '.--.//')
    .replace(/q/gi, '--.-//')
    .replace(/r/gi, '.-.//')
    .replace(/s/gi, '...//')
    .replace(/t/gi, '-//')
    .replace(/u/gi, '..-//')
    .replace(/v/gi, '...-//')
    .replace(/w/gi, '.--//')
    .replace(/x/gi, '-..-//')
    .replace(/y/gi, '-.--//')
    .replace(/z/gi, '--..////');
}

const hodorFront = ['Hodor! Hodor hodor, ','Hodor hodor HODOR! Hodor ','Hodor, hodor. Hodor. Hodor, ','Hodor, ','Hodor. Hodor ','Hodor ','Hodor hodor - '];
const hodorMiddle = ['HODOR hodor, hodor ','hodor ','hodor, hodor. Hodor ','hodor... Hodor hodor ','hodor - ','hodor hodor ','hodor; hodor '];
const hodorBack = ['hodor. ','hodor? ','hodor hodor! ','hodor?! ','hodor, hodor, hodor hodor. ','hodor. Hodor. '];
function hodor(nparagraphs) {
  let message=''; //inits the var

  for (let p=1;p<=nparagraphs;p++) {  //loops depending on how many paragraphs are chosen
    
    //message+="<p>" //begin paragraph
    
    //if ( $('#formatCode').prop("checked") ) {
    //  message+="&lt;p&gt;"
    //}
    
    for (let s=0;s<=(3+rand(8));s++) { //loops between 3 to 12 sentences into the paragraph
    
      message+=hodorFront[rand(7)]; //grab ONE random entry from the hodorFront array, add to paragraph string
      for (let w=0;w<=rand(4);w++) { //add between 0 and 4 substrings to the middle of the paragraph
        message+=hodorMiddle[rand(7)]; //append a random entry from the hodorMiddle array
      }
      message+=hodorBack[rand(6)]; //grab ONE random entry from the hodorBack array, this is the end of the paragraph
      
    }

    message += '\n\n';
    
    //if ( $('#formatCode').prop("checked") ) {
    //  message+="&lt;/p&gt;"
    //}
    
    //message+="</p>" //end paragraph

  }
  
  //$('#hodorOutput').html(message); //output paragraph string into #hodorOutput
  
  //$('#hodorOutput').fadeIn(250);
  
  //$.scrollTo( '#hodorOutput', 500 );
  
  return message;
}

module.exports = {
  name: 'swearify-stuff',
  defaultCommandPrefix: 'swearify-stuff',
  commands: {
    sekrit: {
      fn: function(message, suffix) {

        try {
          const ndots = suffix.match(/\./gi).length;
          if (ndots !== 0) {
            const elen = endings.length;
            for (let i = 0; i < ndots; i++) {
              if (Math.random() > 0.9)
                suffix = suffix.replace(/\./, endings[rand(elen)]); // here we use a temp . to prevent mass dupes
            }
            suffix = suffix.replace(/\[dot\]/gi, '.'); // and here we fix the .
          }
        } catch (e) { /* there are no dots in our message */ }

        for (let i = 0, il = replacements.length; i < il; i += 2) {
          suffix = suffix.replace(replacements[i], replacements[i + 1]);
        }

        message.channel.sendMessage(suffix);
      },
      description: 'A sekrit command. It does sekrit things.'
    },

// converters
    leet: {
      fn: function(message, suffix) {
        message.channel.sendMessage(leet(suffix));
      },
      description: 'Ported from Swearify'
    },

    balloon: {
      fn: function(message, suffix) {
        message.channel.sendMessage(balloon(suffix));
      },
      description: 'Ported from Swearify'
    },

    braille: {
      fn: function(message, suffix) {
        message.channel.sendMessage(braille(suffix));
      },
      description: 'Ported from Swearify'
    },

    greek: {
      fn: function(message, suffix) {
        message.channel.sendMessage(greek(suffix));
      },
      description: 'Ported from Swearify'
    },

    smallcaps: {
      fn: function(message, suffix) {
        message.channel.sendMessage(smallcaps(suffix));
      },
      synonyms: [ 'small-caps' ],
      description: 'Ported from Swearify'
    },

    morse: {
      fn: function(message, suffix) {
        message.channel.sendMessage(morse(suffix));
      },
      synonyms: [ 'morse-code', 'morsecode' ],
      description: 'Ported from Swearify'
    },

// facts n stuff
    misconceptions: {
      fn: function(message) {
        message.channel.sendMessage(misconceptions[rand(misconceptions.length)]);
      },
      synonyms: [ 'misconception' ],
      description: 'List a common misconception.'
    },
    bibleverses: {
      fn: function(message) {
        message.channel.sendMessage(bibleverses[rand(bibleverses.length)]);
      },
      description: 'Verses from the Holy Book of GNU.'
    },
    slipsum: {
      fn: function(message) {
        message.channel.sendMessage(slipsum[rand(slipsum.length)]);
      },
      description: 'Generate Samuel L. Ipsum!'
    },
    hodor: {
      fn: function(message, suffix) {
        message.channel.sendMessage(hodor(suffix.length ? suffix : 1));
      },
      description: 'Generate Hodor Ipsum!'
    },
    spaceipsum: {
      fn: function(message) {
        message.channel.sendMessage(spaceipsum[rand(spaceipsum.length)]);
      },
      description: 'Ported from Swearify'
    },
    bttfipsum: {
      fn: function(message) {
        message.channel.sendMessage(bttfipsum[rand(bttfipsum.length)]);
      },
      description: 'Ported from Swearify'
    },
    breakingbadipsum: {
      fn: function(message) {
        message.channel.sendMessage(breakingbadipsum[rand(breakingbadipsum.length)]);
      },
      description: 'Ported from Swearify'
    },
    facts: {
      fn: function(message) {
        message.channel.sendMessage(facts[rand(facts.length)]);
      },
      synonyms: [ 'fact' ],
      description: 'Ported from Swearify'
    },

  },
};