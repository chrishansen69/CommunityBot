'use strict';

const toMarkdown = require('./to-markdown.js');

exports.stripTags = function(str) {
  return str.

  replace(/<br>/g, '\n'). // replace newlines
  replace(/<br\/>/g, '\n'). // replace newlines
  replace(/<br \/>/g, '\n'). // replace newlines
  replace(/<\/br>/g, ''). // not \n

  replace(/<img src="(.*?)".*?(>.*?<\/img>|\/>)/gi, '$1'). // replace image links

  replace(/<(?:.|\n)*?>/gm, ''). // strip html tags

  //.replace(/\[link\] \[comments\]/g, '') // reddit [link] and [comments] at the end of post

  replace(/&#32;/g, ' '). // space bug

  replace(/  +/g, ' '). // dupe spaces
  trim(). // remove leading and trailing whitespace

  replace(/\[link\] \[comments\]/g, '') // reddit [link] and [comments] at the end of post

  ;
};

exports.fixTags = function(adesc) {
  return toMarkdown(adesc).

  replace(/<table>/gi, '').
  replace(/<tbody>/gi, '').
  replace(/<tr>/gi, '').
  replace(/<td>/gi, '').
  replace(/<\/table>/gi, '').
  replace(/<\/tbody>/gi, '').
  replace(/<\/tr>/gi, '').
  replace(/<\/td>/gi, '').

  replace(/\n\n/g, '\n').

  replace(/<b>/gi, '**').
  replace(/<\/b>/gi, '**').
  replace(/<i>/gi, '*').
  replace(/<\/i>/gi, '*').

  replace(/<small>/gi, '`').
  replace(/<\/small>/gi, '`').

  replace(/\[!\[(.*?)]\((.*?) \"(.*?)\"\)\]\((.*?)\)/gi, '<Embedded image link: $2 Links to: $4 Hover text: $3'). //image+link (weird format)

  replace(/\[!\[(.*?)]\((.*?)\)\]\((.*?)\)/gi, '<Embedded image link: $2 Links to: $3 Hover text: $1'). //image+link (reg)

  replace(/!\[(.*?)\]\((.*?) \"(.*?)\"\)/gi, '<Embedded image: $2 Hover text: $3>'). // image link (weird format)

  replace(/!\[(.*?)\]\((.*?)\)/gi, '<Embedded image: $2 Hover text: $1>'). // image link

  replace(/\[(.*?)\]\((.*?)\)/gi, '<Link: $2 Text: $1>'). // link

  replace(/<div class="md">/g, '').
  replace(/<\/div>/g, '').

  replace(/<span>/gi, '').
  replace(/<\/span>/gi, '')

  ;
};