'use strict';
const convert = require('./convert');
 const func = convert('round', require('../round'));

func.placeholder = require('./placeholder');
module.exports = func;
