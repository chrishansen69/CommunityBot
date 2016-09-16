'use strict';
const convert = require('./convert');
 const func = convert('matchesProperty', require('../matchesProperty'));

func.placeholder = require('./placeholder');
module.exports = func;
