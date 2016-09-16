'use strict';
const convert = require('./convert');
 const func = convert('some', require('../some'));

func.placeholder = require('./placeholder');
module.exports = func;
