'use strict';
const convert = require('./convert');
 const func = convert('spread', require('../spread'));

func.placeholder = require('./placeholder');
module.exports = func;
