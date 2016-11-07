'use strict';

/**
 * Dependencies
 */

const debug = require('debug')('metalsmith-in-place');
const match = require('multimatch');
const includes = require('string-includes');

/**
 * Checks file
 */

module.exports = function checkFile(filename, pattern) {
  // Only process files that match the pattern
  if (!match(filename, pattern)[0]) {
    debug(`the file '${filename}' doesn't match the pattern '${pattern}'`);
    return false;
  }

  // Only process files with an extension
  if (!includes(filename, '.')) {
    debug(`the file '${filename}' doesn't have an extension`);
    return false;
  }

  return true;
};