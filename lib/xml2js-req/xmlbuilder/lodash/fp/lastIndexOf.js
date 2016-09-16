'use strict';
const convert = require('./convert');
 const func = convert('lastIndexOf', require('../lastIndexOf'));

func.placeholder = require('./placeholder');
module.exports = func;
