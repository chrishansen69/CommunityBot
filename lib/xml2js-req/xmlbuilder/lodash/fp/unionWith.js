'use strict';
const convert = require('./convert');
 const func = convert('unionWith', require('../unionWith'));

func.placeholder = require('./placeholder');
module.exports = func;
