'use strict';
const convert = require('./convert');
 const func = convert('uniqueId', require('../uniqueId'));

func.placeholder = require('./placeholder');
module.exports = func;
