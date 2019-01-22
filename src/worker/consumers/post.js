'use strict';

const AMQPBase = require('amqp-base');

module.exports = function post(deps, channel) {
  const consumer = new AMQPBase.AMQPConsumer(channel, 'worker.post', {
    exchanges: [{ name: 'tasks.post', type: 'direct' }],
    binds: [{ exchange: 'tasks.post', pattern: '' }]
  });
  return consumer.on('message', async function(message, { ack, reject }) {
    try {
      const task = JSON.parse(message.content.toString('utf-8'));
      // Get a (presumably) new comment:
      const comment = await deps.commentRepository.load(task.entityID);
      // TODO: Skip sending e-mail if the comment already exists:
      comment.post(task.subject, task.author, task.message, new Date());
      await deps.commentRepository.persist(comment);
      const token = deps.commentValidator.getToken(comment);
      const mailTaskJSON = JSON.stringify({ comment, token });
      const mailTaskBuffer = Buffer.from(mailTaskJSON, 'utf-8');
      deps.busChannel.publish('tasks.mailVerificationLink', '', mailTaskBuffer);
      deps.logger.info({ event: 'consumers/post#created' }, 'post created and awaiting verification');
      ack();
    } catch (error) {
      deps.logger.error({ event: 'consumers/post#error', error });
      // TODO: Should we retry the operation?
      reject();
    }
  });
};
