'use strict';
const convert = require('./convert');
 const func = convert('throttle', require('../throttle'));

func.placeholder = require('./placeholder');
module.exports = func;
