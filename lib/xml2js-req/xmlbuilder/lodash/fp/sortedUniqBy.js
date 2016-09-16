'use strict';
const convert = require('./convert');
 const func = convert('sortedUniqBy', require('../sortedUniqBy'));

func.placeholder = require('./placeholder');
module.exports = func;
