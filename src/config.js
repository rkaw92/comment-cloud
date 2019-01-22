'use strict';

function fail(error) {
  throw error;
}

module.exports = {
  HTTP_PORT: process.env.HTTP_PORT || 3000,
  EXTERNAL_URL: process.env.EXTERNAL_URL || fail(new Error('Missing env variable EXTERNAL_URL - example: https://comments.example.com/')),
  APP_NAME: process.env.APP_NAME || 'comment-cloud',
  AMQP_URL: process.env.AMQP_URL || 'amqp://localhost/%2f',
  TESTING: Boolean(Number(process.env.TESTING)),
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/comment_cloud',
  COMMENT_VALIDATION_TOKEN: process.env.COMMENT_VALIDATION_TOKEN || fail(new Error('Missing env variable COMMENT_VALIDATION_TOKEN')),
  MAIL_AUTH_URL: process.env.MAIL_AUTH_URL || fail(new Error('Missing env variable MAIL_AUTH_URL')),
  MAIL_FROM: process.env.MAIL_FROM || fail(new Error('Missing env variable MAIL_FROM'))
};
