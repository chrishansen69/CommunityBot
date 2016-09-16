'use strict';
const convert = require('./convert');
 const func = convert('repeat', require('../repeat'));

func.placeholder = require('./placeholder');
module.exports = func;
