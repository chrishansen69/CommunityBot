'use strict';
const convert = require('./convert');
 const func = convert('slice', require('../slice'));

func.placeholder = require('./placeholder');
module.exports = func;
