'use strict';
const convert = require('./convert');
 const func = convert('chunk', require('../chunk'));

func.placeholder = require('./placeholder');
module.exports = func;
