'use strict';
/*
 * to-markdown - an HTML to Markdown converter
 *
 * Copyright 2011+, Dom Christie
 * Licenced under the MIT licence
 *
 */


let toMarkdown; // eslint-disable-line prefer-const
let converters;
const mdConverters = require('./lib/md-converters.js');
const gfmConverters = require('./lib/gfm-converters.js');
const HtmlParser = require('./lib/html-parser.js');
const collapse = require('./meta-lib/collapse-whitespace.js');

/*
 * Utilities
 */
const blocks = ['address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas', 'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav', 'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'];
function isBlock(node) {
  return blocks.indexOf(node.nodeName.toLowerCase()) !== -1;
}

const voids = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
function isVoid(node) {
  return voids.indexOf(node.nodeName.toLowerCase()) !== -1;
}

function htmlToDom(string) {
  const tree = new HtmlParser().parseFromString(string, 'text/html');
  collapse(tree.documentElement, isBlock);
  return tree;
}

/*
 * Flattens DOM tree into single array
 */
function bfsOrder(node) {
  const inqueue = [node];
  const outqueue = [];
  let elem;
  let children;
  let i;
  while (inqueue.length > 0) {
    elem = inqueue.shift();
    outqueue.push(elem);
    children = elem.childNodes;
    for (i = 0; i < children.length; i++) {
      if (children[i].nodeType === 1) inqueue.push(children[i]);
    }
  }
  outqueue.shift();
  return outqueue;
}

/*
 * Contructs a Markdown string of replacement text for a given node
 */
function getContent(node) {
  let text = '';
  for (let i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes[i].nodeType === 1) {
      text += node.childNodes[i]._replacement;
    } else if (node.childNodes[i].nodeType === 3) {
      text += node.childNodes[i].data;
    } else continue;
  }
  return text;
}

/*
 * Returns the HTML string of an element with its contents converted
 */
function outer(node, content) {
  return node.cloneNode(false).outerHTML.replace('><', '>' + content + '<');
}

function canConvert(node, filter) {
  if (typeof filter === 'string') {
    return filter === node.nodeName.toLowerCase();
  }
  if (Array.isArray(filter)) {
    return filter.indexOf(node.nodeName.toLowerCase()) !== -1;
  } else if (typeof filter === 'function') {
    return filter.call(toMarkdown, node);
  }// else {
  throw new TypeError('`filter` needs to be a string, array, or function');
}

function isFlankedByWhitespace(side, node) {
  let sibling;
  let regExp;
  let isFlanked;
  if (side === 'left') {
    sibling = node.previousSibling;
    regExp = / $/;
  } else {
    sibling = node.nextSibling;
    regExp = /^ /;
  }
  if (sibling) {
    if (sibling.nodeType === 3) {
      isFlanked = regExp.test(sibling.nodeValue);
    } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
      isFlanked = regExp.test(sibling.textContent);
    }
  }
  return isFlanked;
}

function flankingWhitespace(node) {
  let leading = '';
  let trailing = '';
  if (!isBlock(node)) {
    const hasLeading = /^[ \r\n\t]/.test(node.innerHTML);
    const hasTrailing = /[ \r\n\t]$/.test(node.innerHTML);
    if (hasLeading && !isFlankedByWhitespace('left', node)) {
      leading = ' ';
    }
    if (hasTrailing && !isFlankedByWhitespace('right', node)) {
      trailing = ' ';
    }
  }
  return {
    leading: leading,
    trailing: trailing
  };
}

/*
 * Finds a Markdown converter, gets the replacement, and sets it on
 * `_replacement`
 */
function process(node) {
  let replacement;
  let content = getContent(node); // Remove blank nodes
  if (!isVoid(node) && !/A|TH|TD/.test(node.nodeName) && /^\s*$/i.test(content)) {
    node._replacement = '';
    return;
  }
  for (let i = 0; i < converters.length; i++) {
    const converter = converters[i];
    if (canConvert(node, converter.filter)) {
      if (typeof converter.replacement !== 'function') {
        throw new TypeError('`replacement` needs to be a function that returns a string');
      }
      const whitespace = flankingWhitespace(node);
      if (whitespace.leading || whitespace.trailing) {
        content = content.trim();
      }
      replacement = whitespace.leading + converter.replacement.call(toMarkdown, content, node) + whitespace.trailing;
      break;
    }
  }
  node._replacement = replacement;
}

toMarkdown = function(input, options) {
  options = options || {};
  if (typeof input !== 'string') {
    throw new TypeError(input + ' is not a string');
  }
  // Escape potential ol triggers
  input = input.replace(/(\d+)\. /g, '$1\\. ');
  const clone = htmlToDom(input).body;
  const nodes = bfsOrder(clone);
  converters = mdConverters.slice(0);
  if (options.gfm) {
    converters = gfmConverters.concat(converters);
  }
  if (options.converters) {
    converters = options.converters.concat(converters);
  }
  // Process through nodes in reverse (so deepest child elements are first).
  for (let i = nodes.length - 1; i >= 0; i--) {
    process(nodes[i]);
  }
  const output = getContent(clone);
  return output.replace(/^[\t\r\n]+|[\t\r\n\s]+$/g, '').replace(/\n\s+\n/g, '\n\n').replace(/\n{3,}/g, '\n\n');
};

toMarkdown.isBlock = isBlock;
toMarkdown.isVoid = isVoid;
toMarkdown.outer = outer;
module.exports = toMarkdown;