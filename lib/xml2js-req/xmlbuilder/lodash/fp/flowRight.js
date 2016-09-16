'use strict';
const convert = require('./convert');
 const func = convert('flowRight', require('../flowRight'));

func.placeholder = require('./placeholder');
module.exports = func;
