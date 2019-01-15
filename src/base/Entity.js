'use strict';

class Entity {
  constructor({ entityID = null, entityVersion = 0 } = {}) {
    Object.defineProperty(this, '_entityID', {
      writable: false,
      configurable: false,
      enumerable: false,
      value: entityID
    });
    Object.defineProperty(this, '_entityVersion', {
      writable: false,
      configurable: false,
      enumerable: false,
      value: entityVersion
    });
  }

  getEntityID() {
    return this._entityID;
  }

  getEntityVersion() {
    return this._entityVersion;
  }

  static fromRepositoryEntry(data) {
    return new this(data);
  }

  toRepositoryEntry() {
    return this;
  }

  toJSON() {
    return Object.assign({
      entityID: this.getEntityID(),
      entityVersion: this.getEntityVersion()
    }, this);
  }
}

module.exports = Entity;
