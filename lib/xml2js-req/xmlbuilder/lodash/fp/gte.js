'use strict';
const convert = require('./convert');
 const func = convert('gte', require('../gte'));

func.placeholder = require('./placeholder');
module.exports = func;
