'use strict';

const handler = require('../../utils/handler');
const verifyOrigin = require('../../utils/verifyOrigin');
const OriginError = require('../../classes/errors/OriginError');

module.exports = function(router, deps) {
  // TODO: Add a JSON schema.
  router.post('/comments/', deps.siteCORS, handler(async function(req, res) {
    // Make sure that the target domain is the same as the request origin:
    verifyOrigin(req.body.subject, req.headers.origin);
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
