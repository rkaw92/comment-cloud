'use strict';

const ValueObject = require('../base/ValueObject');

class Author extends ValueObject {
  constructor({ name, email = null }) {
    if (!name || typeof name !== 'string') {
      throw new TypeError('Author#name must be a string');
    }
    if (email !== null && (typeof email !== 'string' || !email)) {
      throw new TypeError('Author#email must be null or a non-empty string');
    }
    super({ name, email });
  }

  isVerifiable() {
    return (this.email);
  }
}

module.exports = Author;
