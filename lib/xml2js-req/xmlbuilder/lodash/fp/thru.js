'use strict';
const convert = require('./convert');
 const func = convert('thru', require('../thru'));

func.placeholder = require('./placeholder');
module.exports = func;
