'use strict';
const convert = require('./convert');
 const func = convert('assignIn', require('../assignIn'));

func.placeholder = require('./placeholder');
module.exports = func;
