'use strict';
const convert = require('./convert');
 const func = convert('inRange', require('../inRange'));

func.placeholder = require('./placeholder');
module.exports = func;
