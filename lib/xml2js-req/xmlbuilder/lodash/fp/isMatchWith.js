'use strict';
const convert = require('./convert');
 const func = convert('isMatchWith', require('../isMatchWith'));

func.placeholder = require('./placeholder');
module.exports = func;
