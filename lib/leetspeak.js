'use strict';

// The package.json for this has everything but a license, and the package is on npm, so we'll assume it's MIT
// Created by Joe Andaverde <https://github.com/joeandaverde/>

const map = {
   'a': '4',
   'e': '3',
   'f': 'ph',
   'g': '9',
   'l': '1',
   'o': '0',
   's': '5',
   't': '7',
   'y': '`/'
};

module.exports = function (str) {
   if (str === null || typeof str === 'undefined') {
      return;
   }

   let newStr = '';

   for (let i = 0; i < str.length; i++) {
      newStr += map[str[i].toLowerCase()] || str[i];
   }

   return newStr;
};