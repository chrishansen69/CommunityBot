'use strict';
const convert = require('./convert');
 const func = convert('bind', require('../bind'));

func.placeholder = require('./placeholder');
module.exports = func;
