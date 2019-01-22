'use strict';

// ### Technical requires ###
const nodemailer = require('nodemailer');
const pino = require('pino');
const MongoRepository = require('../base/MongoRepository');
const AMQPBase = require('amqp-base');
const config = require('../config');

// ### Technical initialization ###
const logger = pino({ name: config.APP_NAME, base: { component: 'worker' }, serializers: { error: pino.stdSerializers.err } });
const mailTransport = nodemailer.createTransport(config.MAIL_AUTH_URL);
const busConnector = new AMQPBase.AMQPConnector(config.AMQP_URL);

// ### Domain requires ###
const CommentRepository = require('../classes/CommentRepository');
const CommentValidator = require('../utils/CommentValidator');
const CommentTokenMailer = require('../utils/CommentTokenMailer');

// ### Domain initialization ###
const commentRepository = new CommentRepository(new MongoRepository({ URL: config.MONGODB_URL, collectionName: 'Comment' }));
const commentValidator = new CommentValidator({ key: config.COMMENT_VALIDATION_TOKEN });
const mailOptions = { from: config.MAIL_FROM };
const externalURL = config.EXTERNAL_URL;
const commentTokenMailer = new CommentTokenMailer({ commentValidator, mailTransport, mailOptions, externalURL });

// ### Worker requires ###
const consumers = require('../worker/consumers');

// ### Worker dependencies ###
const deps = {
  config,
  logger,
  commentRepository,
  commentValidator,
  commentTokenMailer,
  busChannel: null
};

// ### Worker start ###
busConnector.start();
busConnector.on('connect', function(connection) {
  logger.info({ event: 'worker#connect' }, 'connected to AMQP');
  // Create our consumers with the listener utility:
  const consumerCreators = Object.keys(consumers).map(function(consumerName) {
    return consumers[consumerName].bind(undefined, deps);
  });
  const listener = new AMQPBase.AMQPListener(connection, consumerCreators);
  listener.listen();
  // Also ensure we've got a sending channel to work with.
  // TODO: Consider making this a confirm channel.
  const channelManager = new AMQPBase.AMQPChannelManager(connection);
  channelManager.on('create', function(channel) {
    deps.busChannel = channel;
  });
  channelManager.on('close', function() {
    deps.busChannel = null;
  });
  channelManager.start();
});
