'use strict';

function cell(content, node) {
  const index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  let prefix = ' ';
  if (index === 0) prefix = '| ';
  return prefix + content + ' |';
}
const highlightRegEx = /highlight highlight-(\S+)/;
module.exports = [{
    filter: 'br',
    replacement: function() {
      return '\n';
    }
  }, {
    filter: ['del', 's', 'strike'],
    replacement: function(content) {
      return '~~' + content + '~~';
    }
  }, {
    filter: function(node) {
      return node.type === 'checkbox' && node.parentNode.nodeName === 'LI';
    },
    replacement: function(content, node) {
      return (node.checked ? '[x]' : '[ ]') + ' ';
    }
  }, {
    filter: ['th', 'td'],
    replacement: function(content, node) {
      return cell(content, node);
    }
  }, {
    filter: 'tr',
    replacement: function(content, node) {
      let borderCells = '';
      const alignMap = {
        left: ':--',
        right: '--:',
        center: ':-:'
      };
      if (node.parentNode.nodeName === 'THEAD') {
        for (let i = 0; i < node.childNodes.length; i++) {
          const align = node.childNodes[i].attributes.align;
          let border = '---';
          if (align) border = alignMap[align.value] || border;
          borderCells += cell(border, node.childNodes[i]);
        }
      }
      return '\n' + content + (borderCells ? '\n' + borderCells : '');
    }
  }, {
    filter: 'table',
    replacement: function(content) {
      return '\n\n' + content + '\n\n';
    }
  }, {
    filter: ['thead', 'tbody', 'tfoot'],
    replacement: function(content) {
      return content;
    }
  }, // Fenced code blocks
  {
    filter: function(node) {
      return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
    },
    replacement: function(content, node) {
      return '\n\n```\n' + node.firstChild.textContent + '\n```\n\n';
    }
  }, // Syntax-highlighted code blocks
  {
    filter: function(node) {
      return node.nodeName === 'PRE' && node.parentNode.nodeName === 'DIV' && highlightRegEx.test(node.parentNode.className);
    },
    replacement: function(content, node) {
      const language = node.parentNode.className.match(highlightRegEx)[1];
      return '\n\n```' + language + '\n' + node.textContent + '\n```\n\n';
    }
  }, {
    filter: function(node) {
      return node.nodeName === 'DIV' && highlightRegEx.test(node.className);
    },
    replacement: function(content) {
      return '\n\n' + content + '\n\n';
    }
  }
];