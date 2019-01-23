'use strict';

const handler = require('../../../utils/handler');

module.exports = function(router, deps) {
  router.post('/subjects/:subject/comments/:entityID/verify', handler(async function(req, res) {
    // Check the token against the entityID only - this does not touch the DB:
    const verificationEngine = deps.tokenValidator;
    const verificationToken = req.body.token;
    await verificationEngine.checkToken({ entityID: req.params.entityID }, verificationToken);
    // Queue a validation task:
    const taskJSON = JSON.stringify({
      entityID: req.params.entityID,
      subject: req.params.subject,
      token: verificationToken
    });
    const taskBuffer = Buffer.from(taskJSON, 'utf-8');
    deps.busChannel.publish('tasks.validate', '', taskBuffer);
  }));
};
