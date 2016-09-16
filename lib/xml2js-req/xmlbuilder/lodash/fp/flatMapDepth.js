'use strict';
const convert = require('./convert');
 const func = convert('flatMapDepth', require('../flatMapDepth'));

func.placeholder = require('./placeholder');
module.exports = func;
