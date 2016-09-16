'use strict';
const convert = require('./convert');
 const func = convert('split', require('../split'));

func.placeholder = require('./placeholder');
module.exports = func;
