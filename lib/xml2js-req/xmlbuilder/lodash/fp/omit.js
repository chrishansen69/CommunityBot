'use strict';
const convert = require('./convert');
 const func = convert('omit', require('../omit'));

func.placeholder = require('./placeholder');
module.exports = func;
