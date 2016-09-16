'use strict';
const convert = require('./convert');
 const func = convert('forEach', require('../forEach'));

func.placeholder = require('./placeholder');
module.exports = func;
