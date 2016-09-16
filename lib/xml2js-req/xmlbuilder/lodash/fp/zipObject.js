'use strict';
const convert = require('./convert');
 const func = convert('zipObject', require('../zipObject'));

func.placeholder = require('./placeholder');
module.exports = func;
