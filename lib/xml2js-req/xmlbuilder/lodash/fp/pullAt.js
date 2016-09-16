'use strict';
const convert = require('./convert');
 const func = convert('pullAt', require('../pullAt'));

func.placeholder = require('./placeholder');
module.exports = func;
