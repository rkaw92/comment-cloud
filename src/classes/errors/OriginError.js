'use strict';

const AppError = require('../../base/AppError');

class OriginError extends AppError {
  constructor(underlyingError) {
    super('Origin header check error: ' + underlyingError ? underlyingError.message : 'unknown error');
    this.data = { underlyingError };
  }
}

module.exports = OriginError;
