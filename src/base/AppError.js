'use strict';

class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }
}

module.exports = AppError;
