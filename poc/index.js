'use strict';

// ### Technical requires ###
const fastify = require('fastify');
const pino = require('pino');
const nodemailer = require('nodemailer');
const config = require('./config');
const exit = require('./exit');
const MongoRepository = require('./base/MongoRepository');

// ### Technical initialization ###
const logger = pino({ name: config.APP_NAME });
const app = fastify({ logger });
const mailTransport = nodemailer.createTransport(config.MAIL_AUTH_URL);

// ### Domain requires ###
const CommentRepository = require('./classes/CommentRepository');
// TODO: Move CommentValidator to classes as well?
const CommentValidator = require('./utils/CommentValidator');
const CommentTokenMailer = require('./utils/CommentTokenMailer');

// ### Domain dependencies ###
const commentRepository = new CommentRepository(new MongoRepository({ URL: config.MONGODB_URL, collectionName: 'Comment' }));
const commentValidator = new CommentValidator({ key: config.COMMENT_VALIDATION_TOKEN });
const mailOptions = { from: config.MAIL_FROM };
const commentTokenMailer = new CommentTokenMailer({ commentValidator, mailTransport, mailOptions });
const deps = {
  commentRepository,
  commentValidator,
  commentTokenMailer
};

// ### Routes ###
const routeHandlers = require('./routes');
routeHandlers.forEach(function(handler) {
  handler(app, deps);
});

// ### Listening ###
// TODO: Split this up so that it's possible to run the whole API server
//  embedded in another process.
app.listen(config.HTTP_PORT).then(function _listenSuccessful() {
  logger.info({ event: 'Application.start' }, 'Application server listening');
}, function _listenFailed(error) {
  logger.error({ event: 'Application.fail', error: error }, 'Application server failed to start: ' + (error.message || error));
  exit(2);
});
