'use strict';
const convert = require('./convert');
 const func = convert('assignWith', require('../assignWith'));

func.placeholder = require('./placeholder');
module.exports = func;
