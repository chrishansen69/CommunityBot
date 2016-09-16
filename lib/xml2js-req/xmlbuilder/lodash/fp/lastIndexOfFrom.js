'use strict';
const convert = require('./convert');
 const func = convert('lastIndexOfFrom', require('../lastIndexOf'));

func.placeholder = require('./placeholder');
module.exports = func;
