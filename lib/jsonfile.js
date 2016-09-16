'use strict';

const _fs = require('fs');
let jsonfile; // eslint-disable-line prefer-const

function readFile (file, options, callback) {
  if (!callback) {
    callback = options;
    options = {};
  }

  if (typeof options === 'string') {
    options = {encoding: options};
  }

  options = options || {};
  const fs = options.fs || _fs;

  let shouldThrow = true;
  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
  if ('passParsingErrors' in options) {
    shouldThrow = options.passParsingErrors;
  } else if ('throws' in options) {
    shouldThrow = options.throws;
  }

  fs.readFile(file, options, function (err, data) {
    if (err) return callback(err);

    data = stripBom(data);

    let obj;
    try {
      obj = JSON.parse(data, options ? options.reviver : null);
    } catch (err2) {
      if (shouldThrow) {
        err2.message = file + ': ' + err2.message;
        return callback(err2);
      }// else {
      return callback(null, null);
    }

    callback(null, obj);
  });
}

function readFileSync (file, options) {
  options = options || {};
  if (typeof options === 'string') {
    options = {encoding: options};
  }

  const fs = options.fs || _fs;

  let shouldThrow = true;
  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
  if ('passParsingErrors' in options) {
    shouldThrow = options.passParsingErrors;
  } else if ('throws' in options) {
    shouldThrow = options.throws;
  }

  let content = fs.readFileSync(file, options);
  content = stripBom(content);

  try {
    return JSON.parse(content, options.reviver);
  } catch (err) {
    if (shouldThrow) {
      err.message = file + ': ' + err.message;
      throw err;
    } else {
      return null;
    }
  }
}

function writeFile (file, obj, options, callback) {
  if (!callback) {
    callback = options;
    options = {};
  }
  options = options || {};
  const fs = options.fs || _fs;

  let spaces;
  if (typeof options === 'object' && options !== null) {
    if ('spaces' in options) {
      spaces = options.spaces;
    } else {
      spaces = jsonfile.spaces;
    }
  } else {
    spaces = jsonfile.spaces;
  }

  let str = '';
  try {
    str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n';
  } catch (err) {
    if (callback) return callback(err, null);
  }

  fs.writeFile(file, str, options, callback);
}

function writeFileSync (file, obj, options) {
  options = options || {};
  const fs = options.fs || _fs;

  let spaces;
  if (typeof options === 'object' && options !== null) {
    if ('spaces' in options) {
      spaces = options.spaces;
    } else {
      spaces = jsonfile.spaces;
    }
  } else {
    spaces = jsonfile.spaces;
  }

  const str = JSON.stringify(obj, options.replacer, spaces) + '\n';
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options);
}

function stripBom (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8');
  content = content.replace(/^\uFEFF/, '');
  return content;
}

jsonfile = module.exports = {
  spaces: null,
  readFile: readFile,
  readFileSync: readFileSync,
  writeFile: writeFile,
  writeFileSync: writeFileSync
};
