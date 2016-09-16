'use strict';
const convert = require('./convert');
 const func = convert('indexOfFrom', require('../indexOf'));

func.placeholder = require('./placeholder');
module.exports = func;
