'use strict';

const handler = require('../../../utils/handler');
const verifyOrigin = require('../../../utils/verifyOrigin');

module.exports = function(router, deps) {
  router.post('/subjects/:subject/comments', deps.siteCORS, deps.rateLimitMiddleware, handler(async function(req, res) {
    const subject = req.params.subject;
    // Make sure that the target domain is the same as the request origin:
    if (!deps.config.TESTING) {
      verifyOrigin(subject, req.headers.origin);
    }
    // Send the task to the worker that will actually persist it.
    const taskJSON = JSON.stringify({
      entityID: req.body.entityID,
      subject: subject,
      origin: req.body.origin,
      author: req.body.author,
      message: req.body.message
    });
    const taskBuffer = Buffer.from(taskJSON, 'utf-8');
    deps.busChannel.publish('tasks.post', '', taskBuffer);
  }));
};
