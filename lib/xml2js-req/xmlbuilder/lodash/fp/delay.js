'use strict';
const convert = require('./convert');
 const func = convert('delay', require('../delay'));

func.placeholder = require('./placeholder');
module.exports = func;
