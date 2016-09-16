'use strict';
const Stack = require('./_Stack');
 const arrayEach = require('./_arrayEach');
 const assignMergeValue = require('./_assignMergeValue');
 const baseMergeDeep = require('./_baseMergeDeep');
 const isArray = require('./isArray');
 const isObject = require('./isObject');
 const isTypedArray = require('./isTypedArray');
 const keysIn = require('./keysIn');

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  let props;
  if (!(isArray(source) || isTypedArray(source))) {
    props = keysIn(source);
  }
  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObject(srcValue)) {
      if (!stack) (stack = new Stack());
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      let newValue = customizer ? customizer(object[key], srcValue, (key + ''), object, source, stack) : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  });
}

module.exports = baseMerge;
