'use strict';

const AMQPBase = require('amqp-base');

module.exports = function testConsumer(deps, channel) {
  return (new AMQPBase.AMQPConsumer(channel, 'worker-test', {})).on('message', function(message, { ack, reject, requeue }) {
    console.log(message);
    deps.logger.info({ event: 'testConsumer#message' }, 'got a message');
    ack();
  });
};
