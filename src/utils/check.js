'use strict';

class CheckError extends Error {
  constructor(name, check) {
    super('Input validation failed - variable ' + name + ' fails check: ' + check);
    this.statusCode = 400;
  }
}

function check(inputName, input, predicate) {
  if (typeof predicate === 'function') {
    const checkResult = predicate(input);
    if (!checkResult) {
      throw new CheckError(inputName, predicate);
    }
  } else {
    throw new TypeError('The check() predicate must be a function');
  }
}

module.exports = check;
module.exports.CheckError = CheckError;
