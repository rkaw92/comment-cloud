'use strict';

class ConcurrencyException extends Error {
  constructor(entityID, entityVersion) {
    super('Concurrency exception while attempting to persist entity - please retry the operation');
    this.name = 'ConcurrencyException';
    this.data = {
      entityID,
      entityVersion
    };
  }
}

module.exports = ConcurrencyException;
