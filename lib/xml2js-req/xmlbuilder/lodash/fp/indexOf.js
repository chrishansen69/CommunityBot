'use strict';
const convert = require('./convert');
 const func = convert('indexOf', require('../indexOf'));

func.placeholder = require('./placeholder');
module.exports = func;
