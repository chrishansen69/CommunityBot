'use strict';
const convert = require('./convert');
 const func = convert('intersectionWith', require('../intersectionWith'));

func.placeholder = require('./placeholder');
module.exports = func;
