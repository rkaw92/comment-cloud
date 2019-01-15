'use strict';

const handler = require('../../utils/handler');

module.exports = function(router, deps) {
  // TODO: Add a JSON schema.
  router.post('/comments/', deps.siteCORS, handler(async function(req, res) {
    const comment = await deps.commentRepository.load(req.body.entityID);
    // TODO: URL validation and normalization for subject.
    comment.post(req.body.subject, req.body.author, req.body.message, new Date());
    await deps.commentRepository.persist(comment);
    setImmediate(function() {
      deps.commentTokenMailer.sendToken(comment);
    });
    return comment;
  }));
};
