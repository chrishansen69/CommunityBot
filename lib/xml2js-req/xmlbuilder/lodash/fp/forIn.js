'use strict';
const convert = require('./convert');
 const func = convert('forIn', require('../forIn'));

func.placeholder = require('./placeholder');
module.exports = func;
