'use strict';
const convert = require('./convert');
 const func = convert('template', require('../template'));

func.placeholder = require('./placeholder');
module.exports = func;
