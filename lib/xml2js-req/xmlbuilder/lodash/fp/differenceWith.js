'use strict';
const convert = require('./convert');
 const func = convert('differenceWith', require('../differenceWith'));

func.placeholder = require('./placeholder');
module.exports = func;
