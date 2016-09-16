'use strict';
const getNative = require('./_getNative');
 const root = require('./_root');

/* Built-in method references that are verified to be native. */
const DataView = getNative(root, 'DataView');

module.exports = DataView;
