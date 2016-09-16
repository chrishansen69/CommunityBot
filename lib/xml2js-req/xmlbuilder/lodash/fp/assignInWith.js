'use strict';
const convert = require('./convert');
 const func = convert('assignInWith', require('../assignInWith'));

func.placeholder = require('./placeholder');
module.exports = func;
