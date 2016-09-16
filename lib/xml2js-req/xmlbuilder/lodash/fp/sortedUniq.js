'use strict';
const convert = require('./convert');
 const func = convert('sortedUniq', require('../sortedUniq'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
