'use strict';

const before = [/A/g,/B/g,/C/g,/D/g,/E/g,/F/g,/G/g,/H/g,/I/g,/J/g,/K/g,/L/g,/M/g,/N/g,/O/g,/P/g,/Q/g,/R/g,/S/g,/T/g,/U/g,/V/g,/W/g,/X/g,/Y/g,/Z/g,/a/g,/b/g,/c/g,/d/g,/e/g,/f/g,/g/g,/h/g,/i/g,/j/g,/k/g,/l/g,/m/g,/n/g,/o/g,/p/g,/q/g,/r/g,/s/g,/t/g,/u/g,/v/g,/w/g,/x/g,/y/g,/z/g,/1/g,/2/g,/3/g,/4/g,/5/g,/6/g,/7/g,/8/g,/9/g,/0/g];

const fullwidth = ['Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ','Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ','ａ','ｂ','ｃ','ｄ','ｅ','ｆ','ｇ','ｈ','ｉ','ｊ','ｋ','ｌ','ｍ','ｎ','ｏ','ｐ','ｑ','ｒ','ｓ','ｔ','ｕ','ｖ','ｗ','ｘ','ｙ','ｚ','１','２','３','４','５','６','７','８','９','０'];
const parenthesized = ['⒜','⒝','⒞','⒟','⒠','⒡','⒢','⒣','⒤','⒥','⒦','⒧','⒨','⒩','⒪','⒫','⒬','⒭','⒮','⒯','⒰','⒱','⒲','⒳','⒴','⒵','⒜','⒝','⒞','⒟','⒠','⒡','⒢','⒣','⒤','⒥','⒦','⒧','⒨','⒩','⒪','⒫','⒬','⒭','⒮','⒯','⒰','⒱','⒲','⒳','⒴','⒵'];

function apply(suffix, arr) {
  for (let j = 0; j < before.length; j++) {
    suffix = suffix.replace(before[j], arr[j]);
  }
  return suffix;
}

module.exports = {
  name: 'text-fucker',
  defaultCommandPrefix: 'text-fucker',
  commands: {
    fullwidth: {
      fn: function(message, suffix) {
        message.channel.sendMessage(apply(suffix, fullwidth));
      },
      description: 'Full-width text'
    },

    parenthesized: {
      fn: function(message, suffix) {
        message.channel.sendMessage(apply(suffix, parenthesized));
      },
      description: 'Parenthesized text'
    },
  },
};