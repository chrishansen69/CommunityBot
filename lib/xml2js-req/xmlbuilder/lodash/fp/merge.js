'use strict';
const convert = require('./convert');
 const func = convert('merge', require('../merge'));

func.placeholder = require('./placeholder');
module.exports = func;
