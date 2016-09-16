'use strict';
const convert = require('./convert');
 const func = convert('isEqual', require('../isEqual'));

func.placeholder = require('./placeholder');
module.exports = func;
