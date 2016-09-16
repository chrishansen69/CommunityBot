'use strict';
const convert = require('./convert');
 const func = convert('xorWith', require('../xorWith'));

func.placeholder = require('./placeholder');
module.exports = func;
