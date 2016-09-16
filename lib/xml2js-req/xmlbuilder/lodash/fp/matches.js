'use strict';
const convert = require('./convert');
 const func = convert('matches', require('../matches'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
