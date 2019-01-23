'use strict';

const AMQPBase = require('amqp-base');

module.exports = function validate(deps, channel) {
  const consumer = new AMQPBase.AMQPConsumer(channel, 'worker.validate', {
    exchanges: [{ name: 'tasks.validate', type: 'direct' }],
    binds: [{ exchange: 'tasks.validate', pattern: '' }]
  });
  return consumer.on('message', async function(message, { ack, reject }) {
    try {
      const task = JSON.parse(message.content.toString('utf-8'));
      // Load the existing comment:
      const comment = await deps.commentRepository.load(task.entityID, task.subject);
      comment.validate();
      await deps.commentRepository.persist(comment);
      // TODO: Queue a task for cache invalidation (when we have caching).
      // TODO: Queue a real-time update (requires a delivery mechanism).
      ack();
    } catch (error) {
      deps.logger.error({ event: 'consumers/validate#error', error });
      reject();
    }
  });
};
