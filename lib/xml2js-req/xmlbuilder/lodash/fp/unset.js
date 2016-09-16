'use strict';
const convert = require('./convert');
 const func = convert('unset', require('../unset'));

func.placeholder = require('./placeholder');
module.exports = func;
