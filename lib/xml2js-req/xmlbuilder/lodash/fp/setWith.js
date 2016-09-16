'use strict';
const convert = require('./convert');
 const func = convert('setWith', require('../setWith'));

func.placeholder = require('./placeholder');
module.exports = func;
