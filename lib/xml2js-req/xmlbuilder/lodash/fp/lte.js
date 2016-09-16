'use strict';
const convert = require('./convert');
 const func = convert('lte', require('../lte'));

func.placeholder = require('./placeholder');
module.exports = func;
