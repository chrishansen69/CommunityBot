'use strict';
const convert = require('./convert');
 const func = convert('uniqWith', require('../uniqWith'));

func.placeholder = require('./placeholder');
module.exports = func;
