'use strict';
const convert = require('./convert');
 const func = convert('mergeWith', require('../mergeWith'));

func.placeholder = require('./placeholder');
module.exports = func;
