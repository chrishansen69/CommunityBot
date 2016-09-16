'use strict';
const convert = require('./convert');
 const func = convert('overArgs', require('../overArgs'));

func.placeholder = require('./placeholder');
module.exports = func;
