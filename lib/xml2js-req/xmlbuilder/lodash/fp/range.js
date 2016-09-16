'use strict';
const convert = require('./convert');
 const func = convert('range', require('../range'));

func.placeholder = require('./placeholder');
module.exports = func;
