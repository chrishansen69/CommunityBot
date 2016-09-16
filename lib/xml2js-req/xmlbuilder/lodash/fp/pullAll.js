'use strict';
const convert = require('./convert');
 const func = convert('pullAll', require('../pullAll'));

func.placeholder = require('./placeholder');
module.exports = func;
