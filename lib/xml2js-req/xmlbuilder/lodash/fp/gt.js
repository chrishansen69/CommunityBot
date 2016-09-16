'use strict';
const convert = require('./convert');
 const func = convert('gt', require('../gt'));

func.placeholder = require('./placeholder');
module.exports = func;
