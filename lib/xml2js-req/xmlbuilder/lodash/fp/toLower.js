'use strict';
const convert = require('./convert');
 const func = convert('toLower', require('../toLower'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
