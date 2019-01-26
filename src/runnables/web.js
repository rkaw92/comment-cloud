'use strict';

// ### Technical requires ###
const express = require('express');
const path = require('path');
const pino = require('pino');
const nodemailer = require('nodemailer');
const config = require('../config');
const exit = require('../utils/exit');
const MongoRepository = require('../base/MongoRepository');
const AMQPBase = require('amqp-base');
const RateLimiterMemory = require('rate-limiter-flexible').RateLimiterMemory;

// ### Technical initialization ###
const logger = pino({ name: config.APP_NAME, base: { component: 'web' }, serializers: { error: pino.stdSerializers.err } });
const app = express();
const mailTransport = nodemailer.createTransport(config.MAIL_AUTH_URL);
const siteCORS = require('cors')();
const rateLimiter = new RateLimiterMemory({
  points: config.RATE_LIMIT_POINTS,
  duration: config.RATE_LIMIT_DURATION
});
const rateLimitMiddleware = function rateLimiterMiddleware(req, res, next) {
  // Notice how we're limiting the source IP sooner than the e-mail address -
  //  this way, it's harder to maliciously block an e-mail from the service
  //  using just 1 attacker IP.
  Promise.all([
    rateLimiter.consume(req.ip, 2),
    req.body.email ? rateLimiter.consume(req.body.email, 1) : true
  ]).then(function() {
    next();
  }).catch(function() {
    res.status(429).send('Rate limit reached, please try again later');
  });
};
const router = express.Router();
const busConnector = new AMQPBase.AMQPConnector(config.AMQP_URL);
busConnector.start();

// ### Domain requires ###
const CommentRepository = require('../classes/CommentRepository');
const TokenValidator = require('../utils/TokenValidator');
const CommentTokenMailer = require('../utils/CommentTokenMailer');

// ### Domain dependencies ###
const commentRepository = new CommentRepository(new MongoRepository({ URL: config.MONGODB_URL, collectionName: 'Comment' }));
const tokenValidator = new TokenValidator({ key: config.COMMENT_VALIDATION_TOKEN });
const mailOptions = { from: config.MAIL_FROM };
const externalURL = config.EXTERNAL_URL;
const commentTokenMailer = new CommentTokenMailer({ mailTransport, mailOptions, externalURL });
const deps = {
  config,
  siteCORS,
  rateLimitMiddleware,
  commentRepository,
  tokenValidator,
  commentTokenMailer,
  // TODO: Encapsulate the channel in something with a better API for sending, flow control and channel health reporting.
  busChannel: null
};
// Initialize the AMQP connector and try to keep a channel up:
busConnector.on('connect', function(connection) {
  // TODO: Consider using publisher confirms.
  const channelManager = new AMQPBase.AMQPChannelManager(connection, { confirm: false });
  channelManager.on('create', function(channel) {
    deps.busChannel = channel;
  });
  channelManager.on('close', function() {
    deps.busChannel = null;
  });
  channelManager.start();
});

// ### Routes ###
const routeHandlers = require('../web/routes');
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
app.use('/', express.static(path.join(__dirname, '../../assets/')));
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
