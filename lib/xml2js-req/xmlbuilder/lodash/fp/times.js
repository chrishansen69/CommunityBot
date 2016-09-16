'use strict';
const convert = require('./convert');
 const func = convert('times', require('../times'));

func.placeholder = require('./placeholder');
module.exports = func;
