'use strict';

const handler = require('../../../utils/handler');
const verifyOrigin = require('../../../utils/verifyOrigin');

module.exports = function(router, deps) {
  router.post('/comments/', deps.siteCORS, handler(async function(req, res) {
    // Make sure that the target domain is the same as the request origin:
    if (!deps.config.TESTING) {
      verifyOrigin(req.body.subject, req.headers.origin);
    }
    // Send the task to the
    const taskJSON = JSON.stringify({
      entityID: req.body.entityID,
      subject: req.body.subject,
      origin: req.body.origin,
      author: req.body.author,
      message: req.body.message
    });
    const taskBuffer = Buffer.from(taskJSON, 'utf-8');
    deps.busChannel.publish('tasks.post', '', taskBuffer);
  }));
};
