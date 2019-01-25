'use strict';

const Entity = require('../base/Entity');
const Author = require('./Author');
const check = require('../utils/check');

class Comment extends Entity {
  constructor({ entityID, entityVersion, posted, author, message, date, subject, origin, validated, validationDate }) {
    super({ entityID, entityVersion });
    this.posted = Boolean(posted);
    this.author = author ? new Author(author) : null;
    this.message = message || null;
    this.date = new Date(date);
    this.subject = subject || null;
    this.origin = origin || null;
    this.validated = Boolean(validated);
    this.validationDate = new Date(validationDate);
  }

  post(subject, author, message, date) {
    Comment.checkPost({ subject, author, message, date });
    if (this.posted) {
      return;
    }
    this.subject = subject;
    this.origin = (new URL(subject)).origin;
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
      origin: this.origin,
      author: { name: this.author.name },
      message: this.message,
      date: this.date
    };
  }

  static checkPost({ subject, author, message, date }) {
    check('subject', subject, (text) => typeof text === 'string' && text && text.length <= 256);
    check('author', author, (data) => typeof data === 'object' && data && data.name && typeof data.name === 'string' && data.name.length <= 64 && typeof data.email === 'string' && data.email && data.email.length <= 256);
    check('message', message, (text) => typeof text === 'string' && text.length <= 2000);
    check('date', date, (date) => !isNaN(new Date(date).getTime()));
  }
}

module.exports = Comment;
