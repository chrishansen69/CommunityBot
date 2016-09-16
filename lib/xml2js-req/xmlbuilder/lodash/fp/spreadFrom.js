'use strict';
const convert = require('./convert');
 const func = convert('spreadFrom', require('../spread'));

func.placeholder = require('./placeholder');
module.exports = func;
