'use strict';

const MongoClient = require('mongodb').MongoClient;
const ConcurrencyException = require('./ConcurrencyException');
const when = require('when');

function makeConnectedClient(URL) {
  function _tryConnecting() {
    const client = new MongoClient(URL, { useNewUrlParser: true });
    return client.connect().then(function _connectionOK() {
      // NOTE: No database name passed - uses the name from the URL:
      return client.db();
    }, function _connectionFailed(error) {
      // TODO: Log the connection failure. Note that this is normal when starting a docker-compose.
      return when.resolve().delay(3000).then(_tryConnecting);
    });
  }
  return _tryConnecting();
}

class MongoRepository {
  constructor({ db, URL, collectionName, options }) {
    // TODO: Add custom index support!
    this._collectionName = collectionName;
    if (db) {
      this._dbPromise = Promise.resolve(db);
    } else {
      this._dbPromise = makeConnectedClient(URL);
    }
  }

  async load(entityClass, entityID, query) {
    const db = await this._dbPromise;
    const effectiveQuery = Object.assign({ _id: entityID }, query);
    const rawEntry = await db.collection(this._collectionName).findOne(effectiveQuery);
    const entityData = MongoRepository.makeEntityData(entityID, rawEntry);
    return entityClass.fromRepositoryEntry(entityData);
  }

  async find(entityClass, query, options) {
    const db = await this._dbPromise;
    // TODO: Add maxScan and maxTimeMS to the returned Cursor.
    const rawEntries = await db.collection(this._collectionName).find(query, options).toArray();
    const dataOfEntities = rawEntries.map((rawEntry) => MongoRepository.makeEntityData(rawEntry._id, rawEntry));
    return dataOfEntities.map((entityData) => entityClass.fromRepositoryEntry(entityData));
  }

  async persist(entity) {
    const db = await this._dbPromise;
    const entry = Object.assign({}, entity.toRepositoryEntry(), {
      _id: entity.getEntityID(),
      _version: (entity.getEntityVersion() || 0) + 1
    });
    if (entry._version === 1) {
      return await db.collection(this._collectionName).insertOne(entry);
      // TODO: Handle duplicates when inserting.
    } else {
      const result = await db.collection(this._collectionName).replaceOne({
        _id: entry._id,
        _version: entity.getEntityVersion()
      }, entry);
      // Check if MongoDB reports any matched documents. If not, we've missed
      //  the document - its version must have changed (or it may have been
      //  removed). In any case, that's a concurrency exception!
      if (Number(result.n) === 0) {
        throw new ConcurrencyException(entry._id, entry._version);
      }
    }
  }

  static makeEntityData(entityID, rawEntry) {
    if (rawEntry) {
      return Object.assign(rawEntry, {
        entityID: entityID,
        entityVersion: rawEntry._version
      });
    } else {
      return {
        entityID: entityID,
        entityVersion: 0
      };
    }
  }
}

module.exports = MongoRepository;
