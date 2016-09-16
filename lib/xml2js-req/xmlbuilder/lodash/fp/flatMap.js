'use strict';
const convert = require('./convert');
 const func = convert('flatMap', require('../flatMap'));

func.placeholder = require('./placeholder');
module.exports = func;
