'use strict';
const convert = require('./convert');
 const func = convert('hasIn', require('../hasIn'));

func.placeholder = require('./placeholder');
module.exports = func;
