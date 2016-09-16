'use strict';
const convert = require('./convert');
 const func = convert('set', require('../set'));

func.placeholder = require('./placeholder');
module.exports = func;
