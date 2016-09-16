'use strict';
const convert = require('./convert');
 const func = convert('mapValues', require('../mapValues'));

func.placeholder = require('./placeholder');
module.exports = func;
