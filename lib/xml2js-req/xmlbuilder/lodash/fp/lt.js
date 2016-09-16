'use strict';
const convert = require('./convert');
 const func = convert('lt', require('../lt'));

func.placeholder = require('./placeholder');
module.exports = func;
