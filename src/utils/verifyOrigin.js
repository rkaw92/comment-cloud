'use strict';

const OriginError = require('../classes/errors/OriginError');

function verifyOrigin(subjectString, originString) {
  try {
    if (!subjectString) {
      throw new Error('subject URL not provided');
    }
    if (!originString || originString === 'null') {
      throw new Error('Origin header not present');
    }
    const subjectURL = new URL(subjectString);
    const originURL = new URL(originString);
    if (subjectURL.origin !== originURL.origin) {
      throw new Error(`Origin mismatch - comments are only accepted for the requesting origin (header says ${originURL.origin}, but target origin is ${subjectURL.origin}).`);
    }
  } catch (error) {
    throw new OriginError(error);
  }
}

module.exports = verifyOrigin;
