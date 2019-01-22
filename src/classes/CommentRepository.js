'use strict';

const Comment = require('./Comment');

class CommentRepository {
  constructor(mongoRepository) {
    this._mongoRepository = mongoRepository;
  }

  async load(commentID, subject) {
    if (!subject) {
      throw new Error('CommentRepository#load: subject is required besides commentID');
    }
    return await this._mongoRepository.load(Comment, commentID, { subject: String(subject) });
  }

  async persist(comment) {
    return this._mongoRepository.persist(comment);
  }

  async find(query, options) {
    return this._mongoRepository.find(Comment, query, options);
  }
}

module.exports = CommentRepository;
