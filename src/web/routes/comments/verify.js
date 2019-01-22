'use strict';

const handler = require('../../../utils/handler');

module.exports = function(router, deps) {
  router.post('/subjects/:subject/comments/:entityID/verify', handler(async function(req, res) {
    // TODO: Port this to tasks/workers.
    const verificationEngine = deps.tokenValidator;
    const comment = await deps.commentRepository.load(req.params.entityID, req.params.subject);
    const verificationToken = req.body.token;
    await verificationEngine.checkToken(comment, verificationToken);
    comment.validate(new Date());
    await deps.commentRepository.persist(comment);
    return comment;
  }));
};
