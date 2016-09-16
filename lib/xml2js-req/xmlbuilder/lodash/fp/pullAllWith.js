'use strict';
const convert = require('./convert');
 const func = convert('pullAllWith', require('../pullAllWith'));

func.placeholder = require('./placeholder');
module.exports = func;
