'use strict';
const convert = require('./convert');
 const func = convert('join', require('../join'));

func.placeholder = require('./placeholder');
module.exports = func;
