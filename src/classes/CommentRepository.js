'use strict';

const Comment = require('./Comment');

class CommentRepository {
  constructor(mongoRepository) {
    this._mongoRepository = mongoRepository;
  }

  async load(commentID) {
    return this._mongoRepository.load(Comment, commentID);
  }

  async persist(comment) {
    return this._mongoRepository.persist(comment);
  }

  async find(query, options) {
    return this._mongoRepository.find(Comment, query, options);
  }
}

module.exports = CommentRepository;
