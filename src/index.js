'use strict';

// ### Technical requires ###
const express = require('express');
const path = require('path');
const pino = require('pino');
const nodemailer = require('nodemailer');
const config = require('./config');
const exit = require('./exit');
const MongoRepository = require('./base/MongoRepository');

// ### Technical initialization ###
const logger = pino({ name: config.APP_NAME });
const app = express();
const mailTransport = nodemailer.createTransport(config.MAIL_AUTH_URL);
const siteCORS = require('cors')();
const router = express.Router();

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
  siteCORS,
  commentRepository,
  commentValidator,
  commentTokenMailer
};

// ### Routes ###
const routeHandlers = require('./routes');
routeHandlers.forEach(function(handler) {
  handler(router, deps);
});

// ### Middleware initialization ###
function loggerMiddleware(req, res, next) {
  logger.info({ event: 'request.end', method: req.method, url: req.url });
  next();
}
app.use(require('body-parser').json());
app.use(router);
app.use('/ui', express.static(path.join(__dirname, '../assets/')));
app.use(loggerMiddleware);

// ### Listening ###
// TODO: Split this up so that it's possible to run the whole API server
//  embedded in another process.
(new Promise(function(fulfill, reject) {
  app.listen(config.HTTP_PORT, fulfill);
  app.once('error', reject);
})).then(function _listenSuccessful() {
  logger.info({ event: 'Application.start' }, 'Application server listening');
}, function _listenFailed(error) {
  logger.error({ event: 'Application.fail', error: error }, 'Application server failed to start: ' + (error.message || error));
  exit(2);
});
