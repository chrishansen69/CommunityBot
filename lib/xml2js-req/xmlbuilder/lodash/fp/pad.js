'use strict';
const convert = require('./convert');
 const func = convert('pad', require('../pad'));

func.placeholder = require('./placeholder');
module.exports = func;
