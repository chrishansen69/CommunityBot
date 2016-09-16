'use strict';
const convert = require('./convert');
 const func = convert('rearg', require('../rearg'));

func.placeholder = require('./placeholder');
module.exports = func;
