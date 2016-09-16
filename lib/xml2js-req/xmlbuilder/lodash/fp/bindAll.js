'use strict';
const convert = require('./convert');
 const func = convert('bindAll', require('../bindAll'));

func.placeholder = require('./placeholder');
module.exports = func;
