'use strict';
const convert = require('./convert');
 const func = convert('flatMapDeep', require('../flatMapDeep'));

func.placeholder = require('./placeholder');
module.exports = func;
