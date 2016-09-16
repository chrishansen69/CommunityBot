'use strict';
const convert = require('./convert');
 const func = convert('reduceRight', require('../reduceRight'));

func.placeholder = require('./placeholder');
module.exports = func;
