'use strict';
const convert = require('./convert');
 const func = convert('transform', require('../transform'));

func.placeholder = require('./placeholder');
module.exports = func;
