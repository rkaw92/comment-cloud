'use strict';

const AMQPBase = require('amqp-base');

module.exports = function mailVerificationLink(deps, channel) {
  const consumer = new AMQPBase.AMQPConsumer(channel, 'worker.mailVerificationLink', {
    exchanges: [{ name: 'tasks.mailVerificationLink', type: 'direct' }],
    binds: [{ exchange: 'tasks.mailVerificationLink', pattern: '' }]
  });
  return consumer.on('message', async function(message, { ack, reject }) {
    try {
      const task = JSON.parse(message.content.toString('utf-8'));
      await deps.commentTokenMailer.sendToken(task.comment, task.token);
      // TODO: Move this log message into the mailer class itself.
      deps.logger.info({ event: 'consumers/mailVerificationLink#sent', to: task.comment.author.email }, 'verification mail sent');
      ack();
    } catch (error) {
      console.log(error);
      deps.logger.error({ event: 'consumers/mailVerificationLink#error', error }, 'an error occurred when trying to send a comment verification e-mail');
      // TODO: Should we retry the operation?
      reject();
    }
  });
};
