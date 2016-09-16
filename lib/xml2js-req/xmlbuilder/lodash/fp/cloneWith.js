'use strict';
const convert = require('./convert');
 const func = convert('cloneWith', require('../cloneWith'));

func.placeholder = require('./placeholder');
module.exports = func;
