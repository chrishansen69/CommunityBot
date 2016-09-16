'use strict';
const convert = require('./convert');
 const func = convert('iteratee', require('../iteratee'));

func.placeholder = require('./placeholder');
module.exports = func;
