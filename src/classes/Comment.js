'use strict';

const Entity = require('../base/Entity');
const Author = require('./Author');

class Comment extends Entity {
  constructor({ entityID, entityVersion, posted, author, message, date, subject, validated, validationDate }) {
    super({ entityID, entityVersion });
    this.posted = Boolean(posted);
    this.author = author ? new Author(author) : null;
    this.message = message || null;
    this.date = new Date(date);
    this.subject = subject || null;
    this.validated = Boolean(validated);
    this.validationDate = new Date(validationDate);
  }

  post(subject, author, message, date) {
    if (this.posted) {
      return;
    }
    this.subject = subject;
    this.author = new Author(author);
    if (!this.author.isVerifiable()) {
      throw new Error('Author not verifiable - at least an e-mail address must be provided');
    }
    this.message = message;
    this.date = new Date(date);
    this.posted = true;
    this.validated = false;
    this.validationDate = null;
  }

  validate(date) {
    if (!this.posted) {
      const error = new Error('Cannot validate - comment does not exist');
      error.statusCode = 404;
      throw error;
    }
    if (this.validated) {
      return;
    }
    this.validated = true;
    this.validationDate = new Date(date);
  }

  getPublicData() {
    return {
      entityID: this.getEntityID(),
      subject: this.subject,
      author: { name: this.author.name },
      message: this.message,
      date: this.date
    };
  }
}

module.exports = Comment;
