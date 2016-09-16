'use strict';
const convert = require('./convert');
 const func = convert('fromPairs', require('../fromPairs'));

func.placeholder = require('./placeholder');
module.exports = func;
