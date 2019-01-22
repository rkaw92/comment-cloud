'use strict';

const crypto = require('crypto');

class TokenValidator {
  constructor({ key, algorithm = 'sha256' }) {
    if (!key) {
      throw new Error('No key passed to TokenValidator');
    }
    if (typeof key !== 'string' || key.length < 16) {
      throw new Error('Invalid key passed to TokenValidator (need a string of at least 16 chars)');
    }
    this._key = key;
    this._algorithm = algorithm;
  }
  getToken(comment) {
    const entityID = comment.getEntityID();
    const mac = crypto.createHmac(this._algorithm, this._key);
    mac.update(entityID);
    const resultHash = mac.digest('hex');
    return resultHash;
  }
  checkToken(comment, token) {
    const expectedValue = this.getToken(comment);
    if (expectedValue !== token) {
      throw new TokenValidator.CommentValidationFailedError();
    }
  }
}

TokenValidator.CommentValidationFailedError = class CommentValidationFailedError extends Error {
  constructor() {
    super('Comment validation failed due to invalid token');
    this.name = 'CommentValidationFailedError';
    this.statusCode = 401;
  }
};

module.exports = TokenValidator;
