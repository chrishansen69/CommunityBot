'use strict';
const convert = require('./convert');
 const func = convert('random', require('../random'));

func.placeholder = require('./placeholder');
module.exports = func;
