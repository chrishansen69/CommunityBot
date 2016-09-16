'use strict';
const convert = require('./convert');
 const func = convert('zipWith', require('../zipWith'));

func.placeholder = require('./placeholder');
module.exports = func;
