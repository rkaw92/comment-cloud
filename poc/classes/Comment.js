'use strict';

const Entity = require('../base/Entity');

class Comment extends Entity {
  constructor({ entityID, entityVersion, posted, author, message, date, subject, validated, validationDate }) {
    console.log('comment: %j', arguments);
    super({ entityID, entityVersion });
    this.posted = Boolean(posted);
    this.author = author || null;
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
    this.author = author;
    this.message = message;
    this.date = new Date(date);
    this.posted = true;
    this.validated = false;
    this.validationDate = null;
  }

  validate(date) {
    if (this.validated) {
      return;
    }
    this.validated = true;
    this.validationDate = new Date(date);
  }
}

module.exports = Comment;
